import React, { useState, useEffect, useRef, type JSX } from "react";
import { Link } from "react-router";
import {
  StorageService,
  type Usuario,
  type Cita,
  type PlanNutricional,
  type Metrica,
  type Examen,
} from "../services/StorageService";

export type AccountTab =
  | "resumen"
  | "citas"
  | "plan"
  | "evolucion"
  | "examenes"
  | "compras";

export default function Account(): JSX.Element {
  const [activeTab, setActiveTab] = useState<AccountTab>("resumen");

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [plan, setPlan] = useState<PlanNutricional | null>(null);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileForm, setProfileForm] = useState<Usuario | null>(null);

  const [isBookingCita, setIsBookingCita] = useState<boolean>(false);
  const [bookingForm, setBookingForm] = useState({
    fecha: "",
    hora: "",
    tipo: "Consulta Presencial",
    profesional: "Nut. Andrea Valdés",
  });

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "danger" | "warning";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    StorageService.initDB();
    setTimeout(() => {
      const dbUser = StorageService.getUsuario();
      setUsuario(dbUser);
      setProfileForm(dbUser);
      setCitas(StorageService.getCitas());
      setPlan(StorageService.getPlan());
      setMetricas(StorageService.getMetricas());
      setExamenes(StorageService.getExamenes());
      setIsLoading(false);
    }, 600);
  }, []);

  const getTabClass = (tabName: AccountTab) =>
    `nav-link fw-semibold rounded-3 px-3 py-2 text-start w-100 border-0 ${
      activeTab === tabName
        ? "active bg-success text-white"
        : "text-dark bg-light"
    }`;

  const showNotification = (
    message: string,
    type: "success" | "danger" | "warning",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleCancelarCita = (id: string) => {
    StorageService.cancelarCita(id);
    setCitas(StorageService.getCitas());
    showNotification("Cita cancelada exitosamente.", "warning");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profileForm) {
      setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    }
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (profileForm) {
      StorageService.updateUsuario(profileForm);
      setUsuario(profileForm);
      setIsEditingProfile(false);
      showNotification("Perfil actualizado correctamente.", "success");
    }
  };

  const handleCancelEdit = () => {
    setProfileForm(usuario);
    setIsEditingProfile(false);
  };

  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return "";
    const date = new Date(fechaISO + "T00:00:00");
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevaCita: Cita = {
      id: `c${Date.now()}`,
      fecha: formatearFecha(bookingForm.fecha),
      hora: bookingForm.hora,
      tipo: bookingForm.tipo,
      profesional: bookingForm.profesional,
      estado: "Programada",
    };
    StorageService.addCita(nuevaCita);
    setCitas(StorageService.getCitas());
    setIsBookingCita(false);
    showNotification("Cita agendada exitosamente.", "success");
    setBookingForm({
      fecha: "",
      hora: "",
      tipo: "Consulta Presencial",
      profesional: "Nut. Andrea Valdés",
    });
  };

  const handleDescargarPDF = () => {
    if (!plan || !usuario) return;
    let content = `======================================\n    CLÍNICA NUTRIVIDA - PAUTA CLINICA\n======================================\n\n`;
    content += `Paciente: ${usuario.nombre}\nFecha de Emisión: ${new Date().toLocaleDateString("es-CL")}\nObjetivo: ${plan.objetivo}\nRequerimiento Calórico: ${plan.caloriasDiarias} kcal\n\n`;
    content += `--- DISTRIBUCIÓN DE MACRONUTRIENTES ---\n`;
    plan.macros.forEach((m) => {
      content += `- ${m.nombre}: ${m.gramos}g (${m.porcentaje}%)\n`;
    });
    content += `\n--- ESTRUCTURA DIARIA ---\n`;
    plan.comidas.forEach((c) => {
      content += `\n[${c.horario}] ${c.tipo.toUpperCase()}:\n${c.descripcion}\n`;
    });
    content += `\n======================================\nDocumento generado automáticamente.\nFirma Nutricionista Tratante.`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const safeUserName = usuario.nombre.replace(/[^a-zA-Z0-9]/g, "_");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Plan_Nutricional_${safeUserName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      showNotification(
        "Error: Formato no permitido. Solo se aceptan archivos PDF, JPG o PNG.",
        "danger",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        "Error: El documento excede el límite máximo de 5MB.",
        "danger",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    let rawName = file.name.split("\\").pop()?.split("/").pop() || "documento";
    const sanitizedFileName = rawName.replace(/[^a-zA-Z0-9.\-_]/g, "");

    const nuevoExamen: Examen = {
      id: `e${Date.now()}`,
      nombre: sanitizedFileName,
      fechaSubida: new Date().toLocaleDateString("es-CL"),
      estado: "Pendiente",
    };

    StorageService.addExamen(nuevoExamen);
    setExamenes(StorageService.getExamenes());
    showNotification(
      `Documento "${sanitizedFileName}" subido correctamente.`,
      "success",
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderResumen = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 border-start border-4 border-success">
            <p className="text-muted mb-1 fw-semibold small text-uppercase">
              Próxima Cita
            </p>
            <h5 className="fw-bold text-dark mb-2">
              {citas.find((c) => c.estado === "Programada")?.fecha || "--"}
            </h5>
            <p className="text-success small fw-semibold mb-0">
              {citas.find((c) => c.estado === "Programada")?.tipo ||
                "Sin citas"}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 border-start border-4 border-info">
            <p className="text-muted mb-1 fw-semibold small text-uppercase">
              Último Peso Registrado
            </p>
            <h5 className="fw-bold text-dark mb-2">
              {metricas.length > 0 ? metricas[0].peso : "--"} kg
            </h5>
            <p className="text-muted small mb-0">
              Registrado el {metricas.length > 0 ? metricas[0].fecha : "--"}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 border-start border-4 border-warning">
            <p className="text-muted mb-1 fw-semibold small text-uppercase">
              Objetivo Actual
            </p>
            <h5 className="fw-bold text-dark mb-2">{plan?.objetivo || "--"}</h5>
            <p className="text-muted small mb-0">Déficit calórico leve</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100">
            {!isEditingProfile ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-success mb-0">
                    Información Personal
                  </h5>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Editar datos
                  </button>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted fw-semibold">
                    Nombre Completo
                  </div>
                  <div className="col-sm-8 text-dark">{usuario?.nombre}</div>
                </div>
                <hr className="text-muted my-2 opacity-25" />
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted fw-semibold">
                    Correo Electrónico
                  </div>
                  <div className="col-sm-8 text-dark">{usuario?.email}</div>
                </div>
                <hr className="text-muted my-2 opacity-25" />
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted fw-semibold">
                    Fecha de Nac.
                  </div>
                  <div className="col-sm-8 text-dark">
                    {formatearFecha(usuario?.fechaNacimiento || "")}
                  </div>
                </div>
                <hr className="text-muted my-2 opacity-25" />
                <div className="row">
                  <div className="col-sm-4 text-muted fw-semibold">
                    Dirección
                  </div>
                  <div className="col-sm-8 text-dark">{usuario?.direccion}</div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProfile}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-success mb-0">
                    Editar Información
                  </h5>
                  <div>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn btn-light btn-sm me-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success btn-sm fw-bold"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-muted fw-semibold">
                    Nombre Completo
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="nombre"
                      className="form-control form-control-sm"
                      value={profileForm?.nombre || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-muted fw-semibold">
                    Correo Electrónico
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-sm"
                      value={profileForm?.email || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-muted fw-semibold">
                    Fecha de Nac.
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      name="fechaNacimiento"
                      className="form-control form-control-sm"
                      value={profileForm?.fechaNacimiento || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-muted fw-semibold">
                    Dirección
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="direccion"
                      className="form-control form-control-sm"
                      value={profileForm?.direccion || ""}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100">
            <h5 className="fw-bold text-success mb-4">Documentos Recientes</h5>
            <div
              className="alert alert-warning mt-4 mb-0 border-0 d-flex align-items-start gap-2 rounded-3"
              role="alert"
            >
              <span>⚠️</span>
              <div className="small text-dark">
                <strong>Recordatorio:</strong> Sube tus últimos exámenes de
                sangre antes de la próxima cita.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCitas = () => (
    <div
      className="bg-white p-4 rounded-4 shadow-sm border-0 h-100"
      style={{ minHeight: "50vh" }}
    >
      {!isBookingCita ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-success mb-0">Historial de Citas</h5>
            <button
              onClick={() => setIsBookingCita(true)}
              className="btn btn-success btn-sm fw-bold shadow-sm"
            >
              Agendar Nueva
            </button>
          </div>
          <div className="row g-3">
            {citas.map((cita) => (
              <div key={cita.id} className="col-12">
                <div
                  className={`p-3 rounded-3 border d-flex flex-column flex-md-row justify-content-between align-items-md-center ${cita.estado === "Programada" ? "border-success bg-success-subtle" : "bg-light"}`}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="fw-bold text-dark mb-0">{cita.tipo}</h6>
                      <span
                        className={`badge ${cita.estado === "Programada" ? "bg-success" : cita.estado === "Cancelada" ? "bg-danger" : "bg-secondary"}`}
                      >
                        {cita.estado}
                      </span>
                    </div>
                    <p className="text-muted small mb-0">
                      📅 {cita.fecha} a las {cita.hora} • 👩‍⚕️ {cita.profesional}
                    </p>
                  </div>
                  {cita.estado === "Programada" && (
                    <div className="mt-3 mt-md-0">
                      <button
                        onClick={() => handleCancelarCita(cita.id)}
                        className="btn btn-sm btn-outline-danger me-2"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-success mb-0">Agendar Nueva Cita</h5>
            <button
              onClick={() => setIsBookingCita(false)}
              className="btn btn-outline-secondary btn-sm"
            >
              Volver al Historial
            </button>
          </div>
          <form
            onSubmit={handleBookingSubmit}
            className="bg-light p-4 rounded-3 border"
          >
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold small">
                  Modalidad de Atención
                </label>
                <select
                  name="tipo"
                  className="form-select"
                  value={bookingForm.tipo}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="Consulta Presencial">
                    Consulta Presencial (Temuco)
                  </option>
                  <option value="Control Telemedicina">
                    Control por Telemedicina
                  </option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold small">
                  Profesional Tratante
                </label>
                <select
                  name="profesional"
                  className="form-select"
                  value={bookingForm.profesional}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="Nut. Andrea Valdés">Nut. Andrea Valdés</option>
                  <option value="Nut. Roberto Muñoz">Nut. Roberto Muñoz</option>
                </select>
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold small">
                  Fecha Solicitada
                </label>
                <input
                  type="date"
                  name="fecha"
                  className="form-control"
                  value={bookingForm.fecha}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold small">
                  Hora Sugerida
                </label>
                <input
                  type="time"
                  name="hora"
                  className="form-control"
                  value={bookingForm.hora}
                  onChange={handleBookingChange}
                  required
                />
              </div>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-success fw-bold px-4">
                Confirmar Agendamiento
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );

  const renderPlan = () => {
    if (!plan) return null;
    return (
      <div
        className="bg-white p-4 rounded-4 shadow-sm border-0 h-100"
        style={{ minHeight: "50vh" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-success mb-1">
              Pauta Alimentaria Activa
            </h5>
          </div>
          <button
            onClick={handleDescargarPDF}
            className="btn btn-outline-success btn-sm fw-bold"
          >
            Descargar Pauta (PDF)
          </button>
        </div>
        <div className="row mb-4 g-3">
          {plan.macros.map((macro, idx) => (
            <div key={idx} className="col-4 text-center">
              <p className="text-muted small fw-semibold mb-1">
                {macro.nombre}
              </p>
              <h5 className="fw-bold text-dark mb-2">{macro.gramos}g</h5>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className={`progress-bar bg-${macro.color}`}
                  style={{ width: `${macro.porcentaje}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <hr className="text-muted opacity-25 mb-4" />
        <h6 className="fw-bold text-dark mb-3">Distribución Diaria</h6>
        <div className="d-flex flex-column gap-3">
          {plan.comidas.map((comida) => (
            <div
              key={comida.id}
              className="p-3 bg-light rounded-3 border-start border-4 border-success"
            >
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-success">{comida.tipo}</span>
                <span className="badge bg-secondary-subtle text-secondary">
                  {comida.horario}
                </span>
              </div>
              <p className="text-muted small mb-0">{comida.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEvolucion = () => {
    if (metricas.length === 0) return null;
    const pesoPerdido = (
      metricas[metricas.length - 1].peso - metricas[0].peso
    ).toFixed(1);
    return (
      <div
        className="bg-white p-4 rounded-4 shadow-sm border-0 h-100"
        style={{ minHeight: "50vh" }}
      >
        <h5 className="fw-bold text-success mb-4">Métricas Biométricas</h5>
        <div className="row g-3 mb-4">
          <div className="col-sm-6">
            <div className="bg-success text-white p-3 rounded-4 shadow-sm">
              <p className="small mb-1 opacity-75">Diferencia de Peso</p>
              <h3 className="fw-bold mb-0">
                {parseFloat(pesoPerdido) > 0 ? `+${pesoPerdido}` : pesoPerdido}{" "}
                kg
              </h3>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="bg-light border border-success p-3 rounded-4 shadow-sm text-success">
              <p className="small fw-semibold mb-1">Grasa Corporal Actual</p>
              <h3 className="fw-bold mb-0">{metricas[0].grasa}%</h3>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Fecha de Control</th>
                <th>Peso (kg)</th>
                <th>% Grasa</th>
                <th>Musculatura (kg)</th>
              </tr>
            </thead>
            <tbody>
              {metricas.map((m) => (
                <tr key={m.id}>
                  <td className="fw-semibold text-dark">{m.fecha}</td>
                  <td>{m.peso}</td>
                  <td>{m.grasa}%</td>
                  <td>{m.musculo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderExamenes = () => (
    <div
      className="bg-white p-4 rounded-4 shadow-sm border-0 h-100"
      style={{ minHeight: "50vh" }}
    >
      <h5 className="fw-bold text-success mb-4">Registro Médico</h5>
      <div className="p-4 mb-4 bg-light border border-dashed rounded-4 text-center border-success">
        <div className="fs-1 mb-2">📥</div>
        <h6 className="fw-bold text-dark">Sube tus últimos exámenes</h6>
        <p className="text-muted small mb-3">
          Formatos aceptados: PDF, JPG, PNG (Max. 5MB)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="application/pdf, image/jpeg, image/png"
          onChange={handleFileChange}
        />
        <button
          onClick={triggerFileInput}
          className="btn btn-outline-success btn-sm fw-bold px-4 rounded-pill"
        >
          Seleccionar Archivo
        </button>
      </div>
      <h6 className="fw-bold text-dark mb-3">Historial de Documentos</h6>
      <div className="d-flex flex-column gap-3">
        {examenes.map((examen) => (
          <div
            key={examen.id}
            className="d-flex align-items-center justify-content-between p-3 border rounded-3"
          >
            <div className="d-flex align-items-center gap-3">
              <div className="fs-3">🩺</div>
              <div>
                <h6 className="mb-0 fw-semibold text-dark">{examen.nombre}</h6>
                <small className="text-muted">
                  Subido el {examen.fechaSubida}
                </small>
              </div>
            </div>
            <span
              className={`badge ${examen.estado === "Revisado" ? "bg-success" : "bg-warning text-dark"}`}
            >
              {examen.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompras = () => {
    return (
      <div
        className="bg-white p-4 rounded-4 shadow-sm border-0 h-100"
        style={{ minHeight: "50vh" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-success mb-1">
              Mis Servicios Adquiridos
            </h5>
          </div>
          <Link
            to="/metodologia"
            className="btn btn-outline-success btn-sm fw-bold"
          >
            Ver Catálogo
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto / Servicio</th>
                <th>Fecha de Compra</th>
                <th>Estado</th>
                <th>Monto</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">
                  Evaluación Biométrica Presencial
                </td>
                <td className="text-muted">10 Oct 2026</td>
                <td>
                  <span className="badge bg-success">Activo</span>
                </td>
                <td>$35.000</td>
                <td>
                  <button className="btn btn-sm btn-light text-success fw-semibold border">
                    Agendar Hora
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading)
    return (
      <main className="container-fluid py-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <p className="text-muted fw-semibold">
          Sincronizando portal del paciente...
        </p>
      </main>
    );

  return (
    <main className="container-fluid py-4 px-4 px-md-5 position-relative">
      {notification && (
        <div
          className="position-fixed top-0 end-0 p-4"
          style={{ zIndex: 1100 }}
        >
          <div
            className={`toast show align-items-center text-white bg-${notification.type} border-0 shadow-lg rounded-3`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold px-4 py-3">
                {notification.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-3 m-auto"
                onClick={() => setNotification(null)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <aside className="col-lg-3 col-md-4">
          <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-0">
            <div className="text-center mb-4">
              <div
                className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center fw-bold mb-2"
                style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
              >
                {usuario?.nombre
                  ? usuario.nombre.substring(0, 2).toUpperCase()
                  : "US"}
              </div>
              <h5 className="fw-bold text-dark mb-1">
                {usuario?.nombre || "Usuario"}
              </h5>
              <p className="text-muted small">Paciente activo</p>
            </div>
            <hr className="text-muted mb-4 opacity-25" />
            <div className="nav flex-column nav-pills gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("resumen");
                  setIsBookingCita(false);
                }}
                className={getTabClass("resumen")}
              >
                🏠 Resumen de Cuenta
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("citas");
                  setIsBookingCita(false);
                }}
                className={getTabClass("citas")}
              >
                📅 Mis Citas
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("plan");
                  setIsBookingCita(false);
                }}
                className={getTabClass("plan")}
              >
                🥗 Mi Plan Nutricional
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("evolucion");
                  setIsBookingCita(false);
                }}
                className={getTabClass("evolucion")}
              >
                📊 Evolución y Métricas
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("examenes");
                  setIsBookingCita(false);
                }}
                className={getTabClass("examenes")}
              >
                📁 Exámenes Médicos
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("compras");
                  setIsBookingCita(false);
                }}
                className={getTabClass("compras")}
              >
                🛍️ Mis Servicios
              </button>
            </div>
          </div>
        </aside>

        <section className="col-lg-9 col-md-8">
          <div className="bg-success text-white p-4 rounded-4 shadow-sm mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold mb-1">
                ¡Hola,{" "}
                {usuario?.nombre ? usuario.nombre.split(" ")[0] : "Paciente"}!
              </h3>
              <p className="mb-0 text-white-50">
                Gestiona tu tratamiento, citas y compras en un solo lugar.
              </p>
            </div>
            <div className="d-none d-sm-block fs-1">🌱</div>
          </div>

          {activeTab === "resumen" && renderResumen()}
          {activeTab === "compras" && renderCompras()}
          {activeTab === "citas" && renderCitas()}
          {activeTab === "plan" && renderPlan()}
          {activeTab === "evolucion" && renderEvolucion()}
          {activeTab === "examenes" && renderExamenes()}
        </section>
      </div>
    </main>
  );
}
