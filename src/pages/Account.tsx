import { useState, useEffect, useRef, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import type {
  Usuario,
  Cita,
  PlanNutricional,
  Metrica,
  Examen,
  Compra,
} from "../data/types";

import { StorageInit } from "../services/storage_init";
import { StorageUsuario } from "../services/storageUsuario";
import { CitasService } from "../services/citasService";
import { PlanService } from "../services/planService";
import { TiendaService } from "../services/tiendaService";
import "../index.css";

export type AccountTab =
  | "resumen"
  | "citas"
  | "plan"
  | "evolucion"
  | "examenes"
  | "compras";

export default function Account(): JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AccountTab>("resumen");

  useEffect(() => {
    const sesion = StorageUsuario.getUsuarioSesion();
    if (!sesion || sesion.rol !== "usuario") {
      navigate("/login");
    }
  }, [navigate]);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [plan, setPlan] = useState<PlanNutricional | null>(null);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados de Edición de Perfil
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileForm, setProfileForm] = useState<Usuario | null>(null);

  // Estados de Cambio de Contraseña
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [passwordActual, setPasswordActual] = useState<string>("");
  const [nuevaPassword, setNuevaPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Estados de Agendamiento de Citas
  const [isBookingCita, setIsBookingCita] = useState<boolean>(false);
  const [bookingForm, setBookingForm] = useState({
    fecha: "",
    hora: "",
    tipo: "Consulta Presencial",
    profesional: "Nut. Andrea Valdés",
  });

  // Nuevos Estados Interactivos para las Pestañas
  const [comidasCompletadas, setComidasCompletadas] = useState<string[]>([]);
  const [isAddingMetrica, setIsAddingMetrica] = useState<boolean>(false);
  const [nuevaMetrica, setNuevaMetrica] = useState({
    peso: "",
    grasa: "",
    musculo: "",
  });

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "danger" | "warning";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    StorageInit.initDB();

    const sesionActiva = StorageUsuario.getUsuarioSesion();
    if (!sesionActiva) {
      navigate("/login", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      const dbUser = StorageUsuario.getUsuarioSesion();

      if (!dbUser) {
        navigate("/login", { replace: true });
        return;
      }

      setUsuario(dbUser);
      setProfileForm(dbUser);

      setCitas(CitasService.getCitas());
      setPlan(PlanService.getPlan());
      setMetricas(PlanService.getMetricas());
      setExamenes(PlanService.getExamenes());
      setCompras(TiendaService.getCompras());

      // Cargar progreso diario de comidas desde localStorage
      const hoyKey = `comidas_${dbUser.email}_${new Date().toLocaleDateString("es-CL")}`;
      const guardadas = localStorage.getItem(hoyKey);
      if (guardadas) {
        setComidasCompletadas(JSON.parse(guardadas));
      }

      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [navigate]);

  const showNotification = (
    message: string,
    type: "success" | "danger" | "warning",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // --- Lógica de Perfil y Avatar ---
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (profileForm) {
      const value =
        e.target.name === "pesoActual"
          ? e.target.value === ""
            ? undefined
            : parseFloat(e.target.value)
          : e.target.value;
      setProfileForm({ ...profileForm, [e.target.name]: value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileForm) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification("La imagen no debe superar los 2MB.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileForm({ ...profileForm, fotoPerfil: base64String });
      showNotification(
        "Foto cargada en vista previa. Pulsa Guardar para confirmar.",
        "success",
      );
    };
    reader.readAsDataURL(file);
  };

  // Nueva función para eliminar la foto de perfil
  const handleRemoveAvatar = () => {
    if (!profileForm) return;
    const copiaPerfil = { ...profileForm };
    delete copiaPerfil.fotoPerfil;
    setProfileForm(copiaPerfil);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
    showNotification(
      "Foto eliminada de la vista previa. Pulsa Guardar para confirmar.",
      "warning",
    );
  };

  const resetPasswordFields = () => {
    setIsChangingPassword(false);
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
    setPasswordError("");
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    if (profileForm && usuario) {
      if (isChangingPassword) {
        const passRegex = /^(?=.*[a-z])(?=.*\d).{9,}$/;

        if (
          !passwordActual.trim() ||
          !nuevaPassword.trim() ||
          !confirmarPassword.trim()
        ) {
          setPasswordError(
            "Completa los 3 campos para actualizar tu contraseña.",
          );
          return;
        }
        if (passwordActual !== usuario.password) {
          setPasswordError("La contraseña actual ingresada es incorrecta.");
          return;
        }
        if (!passRegex.test(nuevaPassword)) {
          setPasswordError(
            "La nueva contraseña no cumple con los requisitos de seguridad.",
          );
          return;
        }
        if (nuevaPassword !== confirmarPassword) {
          setPasswordError(
            "La nueva contraseña y su confirmación no coinciden.",
          );
          return;
        }
      }

      const updatedUser: Usuario = {
        ...profileForm,
        fotoPerfil: profileForm.fotoPerfil, // Asegura que si es undefined se actualice
        ...(isChangingPassword && nuevaPassword.trim() !== ""
          ? { password: nuevaPassword }
          : {}),
      };

      const resultado = StorageUsuario.updateUsuario(
        updatedUser,
        usuario.email,
      );
      if (!resultado.success) {
        showNotification(resultado.mensaje, "danger");
        return;
      }

      setUsuario(updatedUser);
      setProfileForm(updatedUser);
      resetPasswordFields();
      setIsEditingProfile(false);

      showNotification(
        isChangingPassword
          ? "Perfil y contraseña actualizados correctamente."
          : "Datos de perfil actualizados con éxito.",
        "success",
      );
    }
  };

  const handleCancelEdit = () => {
    setProfileForm(usuario);
    resetPasswordFields();
    setIsEditingProfile(false);
  };

  // --- Lógica de Fechas y Citas ---
  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return "";
    if (fechaISO.includes("-")) {
      const parts = fechaISO.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        const date = new Date(fechaISO + "T00:00:00");
        return date.toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
    return fechaISO;
  };

  const handleCancelarCita = (id: string) => {
    CitasService.cancelarCita(id);
    setCitas(CitasService.getCitas());
    showNotification("Cita cancelada exitosamente.", "warning");
  };

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevaCita: Cita = {
      id: `c-${Date.now()}`,
      fecha: formatearFecha(bookingForm.fecha),
      hora: bookingForm.hora,
      tipo: bookingForm.tipo,
      profesional: bookingForm.profesional,
      estado: "Programada",
    };
    CitasService.addCita(nuevaCita);
    setCitas(CitasService.getCitas());
    setIsBookingCita(false);
    showNotification("Cita agendada exitosamente.", "success");
    setBookingForm({
      fecha: "",
      hora: "",
      tipo: "Consulta Presencial",
      profesional: "Nut. Andrea Valdés",
    });
  };

  // Conexión entre pestaña Compras y pestaña Citas
  const handleAgendarDesdeCompra = (nombreServicio: string) => {
    setBookingForm({
      ...bookingForm,
      tipo: nombreServicio,
    });
    setActiveTab("citas");
    setIsBookingCita(true);
    showNotification(
      `Completa la fecha y hora para tu servicio: ${nombreServicio}`,
      "success",
    );
  };

  // --- Lógica de Pauta Alimentaria ---
  const toggleComidaCompletada = (comidaId: string) => {
    if (!usuario) return;
    const hoyKey = `comidas_${usuario.email}_${new Date().toLocaleDateString("es-CL")}`;
    const existe = comidasCompletadas.includes(comidaId);
    const nuevas = existe
      ? comidasCompletadas.filter((id) => id !== comidaId)
      : [...comidasCompletadas, comidaId];

    setComidasCompletadas(nuevas);
    localStorage.setItem(hoyKey, JSON.stringify(nuevas));
  };

  const handleDescargarPDF = () => {
    if (!plan || !usuario) return;
    let content = `======================================\n    CLÍNICA NUTRIVIDA - PAUTA CLÍNICA\n======================================\n\n`;
    content += `Paciente: ${usuario.nombre}\nFecha de Emisión: ${new Date().toLocaleDateString("es-CL")}\nObjetivo: ${usuario.objetivoPrincipal || plan.objetivo}\nRequerimiento Calórico: ${plan.caloriasDiarias} kcal\n\n`;
    content += `--- DISTRIBUCIÓN DE MACRONUTRIENTES ---\n`;
    plan.macros.forEach((m) => {
      content += `- ${m.nombre}: ${m.gramos}g (${m.porcentaje}%)\n`;
    });
    content += `\n--- ESTRUCTURA DIARIA ---\n`;
    plan.comidas.forEach((c) => {
      content += `\n[${c.horario}] ${c.tipo.toUpperCase()}:\n${c.descripcion}\n`;
    });
    content += `\n======================================\nDocumento generado desde el Portal del Paciente.\nClínica NutriVida - Temuco.`;

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
    showNotification("Pauta descargada correctamente.", "success");
  };

  // --- Lógica de Biometría (Evolución) ---
  const handleAddMetricaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pesoNum = parseFloat(nuevaMetrica.peso);
    const grasaNum = parseFloat(nuevaMetrica.grasa);
    const musculoNum = parseFloat(nuevaMetrica.musculo);

    if (!pesoNum || !grasaNum || !musculoNum) return;

    const registro: Metrica = {
      id: `m-${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      peso: pesoNum,
      grasa: grasaNum,
      musculo: musculoNum,
    };

    const actuales = PlanService.getMetricas();
    const actualizadas = [registro, ...actuales];
    localStorage.setItem("db_metricas", JSON.stringify(actualizadas));
    setMetricas(actualizadas);

    // Sincronizar el peso actual del usuario con el nuevo registro
    if (usuario) {
      const userActualizado = { ...usuario, pesoActual: pesoNum };
      StorageUsuario.updateUsuario(userActualizado, usuario.email);
      setUsuario(userActualizado);
      setProfileForm(userActualizado);
    }

    setNuevaMetrica({ peso: "", grasa: "", musculo: "" });
    setIsAddingMetrica(false);
    showNotification(
      "Nuevo control biométrico registrado y sincronizado con tu perfil.",
      "success",
    );
  };

  // --- Lógica de Exámenes Médicos ---
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      showNotification(
        "Formato no permitido. Solo se aceptan PDF, JPG o PNG.",
        "danger",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        "El documento excede el límite máximo de 5MB.",
        "danger",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const rawName =
      file.name.split("\\").pop()?.split("/").pop() || "documento";
    const sanitizedFileName = rawName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const nuevoExamen: Examen = {
      id: `e-${Date.now()}`,
      nombre: sanitizedFileName,
      fechaSubida: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      estado: "Pendiente",
    };

    PlanService.addExamen(nuevoExamen);
    setExamenes(PlanService.getExamenes());
    showNotification(
      `Documento "${sanitizedFileName}" subido correctamente.`,
      "success",
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEliminarExamen = (id: string, nombre: string) => {
    const filtrados = examenes.filter((e) => e.id !== id);
    localStorage.setItem("db_examenes", JSON.stringify(filtrados));
    setExamenes(filtrados);
    showNotification(`Documento "${nombre}" eliminado.`, "warning");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const navItems: { id: AccountTab; icon: string; label: string }[] = [
    { id: "resumen", icon: "🏠", label: "Resumen" },
    { id: "citas", icon: "📅", label: "Mis Citas" },
    { id: "plan", icon: "🥗", label: "Pauta Alimentaria" },
    { id: "evolucion", icon: "📊", label: "Biometría" },
    { id: "examenes", icon: "📁", label: "Exámenes" },
    { id: "compras", icon: "🛍️", label: "Mis Servicios" },
  ];

  /* =========================================================
     RENDERS DE LAS 6 PESTAÑAS
     ========================================================= */

  const renderResumen = () => (
    <div style={{ animation: "fadeSlideUp 0.4s var(--ease-spring)" }}>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div
            onClick={() => setActiveTab("citas")}
            style={{ cursor: "pointer" }}
            className="glass-panel-small p-4 rounded-5 h-100 border-0 hover-lift position-relative overflow-hidden"
          >
            <div className="position-absolute top-0 end-0 p-3 opacity-25 fs-1">
              📅
            </div>
            <p className="text-dark fw-bold small text-uppercase tracking-tight opacity-75 mb-2">
              Próxima Cita
            </p>
            <h4 className="fw-bolder text-dark mb-1 tracking-tight">
              {citas.find((c) => c.estado === "Programada")?.fecha ||
                "Sin agendar"}
            </h4>
            <p className="text-success small fw-semibold mb-0">
              {citas.find((c) => c.estado === "Programada")?.tipo ||
                "Haz clic para programar →"}
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            onClick={() => setActiveTab("evolucion")}
            style={{ cursor: "pointer" }}
            className="glass-panel-small p-4 rounded-5 h-100 border-0 hover-lift position-relative overflow-hidden"
          >
            <div className="position-absolute top-0 end-0 p-3 opacity-25 fs-1">
              ⚖️
            </div>
            <p className="text-dark fw-bold small text-uppercase tracking-tight opacity-75 mb-2">
              Último Peso
            </p>
            <h4 className="fw-bolder text-dark mb-1 tracking-tight">
              {usuario?.pesoActual ||
                (metricas.length > 0 ? metricas[0].peso : "--")}{" "}
              kg
            </h4>
            <p className="text-muted small mb-0">
              {usuario?.pesoActual
                ? "Sincronizado en perfil"
                : metricas.length > 0
                  ? `Control del ${metricas[0].fecha}`
                  : "Registrar peso →"}
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            onClick={() => setActiveTab("plan")}
            style={{
              cursor: "pointer",
              background:
                "linear-gradient(135deg, rgba(46,204,113,0.12) 0%, rgba(255,255,255,0.85) 100%)",
            }}
            className="glass-panel-small p-4 rounded-5 h-100 border-0 hover-lift position-relative overflow-hidden"
          >
            <div className="position-absolute top-0 end-0 p-3 opacity-25 fs-1">
              🎯
            </div>
            <p className="text-success fw-bold small text-uppercase tracking-tight mb-2">
              Objetivo Clínico
            </p>
            <h4 className="fw-bolder text-dark mb-1 tracking-tight">
              {usuario?.objetivoPrincipal || plan?.objetivo || "Por definir"}
            </h4>
            <p className="text-success small mb-0 fw-semibold">
              Ver pauta activa →
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <div className="glass-panel p-4 p-md-5 rounded-5 border-0 h-100">
            {!isEditingProfile ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bolder text-dark tracking-tight mb-0">
                    Información del Paciente
                  </h4>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="btn-kinetic-secondary py-2 px-3 border-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    ✏️ Editar perfil
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex flex-column flex-sm-row justify-content-between sm-align-items-center border-bottom pb-3 border-opacity-10">
                    <span className="text-muted fw-semibold small text-uppercase tracking-tight">
                      Nombre Completo
                    </span>
                    <span className="text-dark fw-bold">{usuario?.nombre}</span>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between sm-align-items-center border-bottom pb-3 border-opacity-10">
                    <span className="text-muted fw-semibold small text-uppercase tracking-tight">
                      Correo Electrónico
                    </span>
                    <span className="text-dark fw-medium">{usuario?.email}</span>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between sm-align-items-center border-bottom pb-3 border-opacity-10">
                    <span className="text-muted fw-semibold small text-uppercase tracking-tight">
                      Fecha de Nacimiento
                    </span>
                    <span className="text-dark fw-medium">
                      {formatearFecha(usuario?.fechaNacimiento || "")}
                    </span>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between sm-align-items-center border-bottom pb-3 border-opacity-10">
                    <span className="text-muted fw-semibold small text-uppercase tracking-tight">
                      Objetivo Principal
                    </span>
                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold align-self-start align-self-sm-auto mt-1 mt-sm-0">
                      {usuario?.objetivoPrincipal ||
                        plan?.objetivo ||
                        "No especificado"}
                    </span>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between sm-align-items-center">
                    <span className="text-muted fw-semibold small text-uppercase tracking-tight">
                      Contraseña
                    </span>
                    <span className="text-muted">••••••••••••</span>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProfile}>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                  <h4 className="fw-bolder text-dark tracking-tight mb-0">
                    Editar Perfil
                  </h4>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn btn-light rounded-pill px-3 py-2 fw-semibold small"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success rounded-pill px-4 py-2 fw-bold small shadow-sm"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>

                {/* GESTIÓN DE FOTO DE PERFIL (SUBIR Y ELIMINAR) */}
                <div className="mb-4 p-3 rounded-4 bg-white border d-flex flex-column flex-sm-row align-items-center gap-3 shadow-sm">
                  <input
                    type="file"
                    ref={avatarInputRef}
                    style={{ display: "none" }}
                    accept="image/jpeg, image/png"
                    onChange={handleAvatarChange}
                  />
                  <div
                    className="rounded-circle d-inline-flex justify-content-center align-items-center fw-bold shadow-sm overflow-hidden flex-shrink-0"
                    style={{
                      width: "72px",
                      height: "72px",
                      fontSize: "1.6rem",
                      backgroundColor: profileForm?.fotoPerfil
                        ? "transparent"
                        : "#198754",
                      color: "white",
                    }}
                  >
                    {profileForm?.fotoPerfil ? (
                      <img
                        src={profileForm.fotoPerfil}
                        alt="Vista previa de perfil"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : profileForm?.nombre ? (
                      profileForm.nombre.substring(0, 2).toUpperCase()
                    ) : (
                      "US"
                    )}
                  </div>
                  <div className="text-center text-sm-start flex-grow-1">
                    <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="btn btn-sm btn-dark rounded-pill px-3 fw-semibold"
                      >
                        📷 Subir Foto
                      </button>
                      {profileForm?.fotoPerfil && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                        >
                          🗑️ Eliminar Foto
                        </button>
                      )}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Formatos soportados: JPG o PNG (Máx. 2MB).
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-bold small text-uppercase tracking-tight mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control apple-input"
                    value={profileForm?.nombre || ""}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-bold small text-uppercase tracking-tight mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control apple-input"
                    value={profileForm?.email || ""}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-5">
                    <label className="form-label text-dark fw-bold small text-uppercase tracking-tight mb-1">
                      Peso Actual (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="pesoActual"
                      className="form-control apple-input"
                      placeholder="Ej. 70.5"
                      value={profileForm?.pesoActual || ""}
                      onChange={handleProfileChange}
                    />
                  </div>

                  {/* SELECTOR DE OBJETIVO PRINCIPAL CON ALTA LEGIBILIDAD */}
                  <div className="col-md-7">
                    <label
                      htmlFor="selectObjetivo"
                      className="form-label text-dark fw-bold small text-uppercase tracking-tight mb-1"
                    >
                      Objetivo Clínico Principal
                    </label>
                    <select
                      id="selectObjetivo"
                      name="objetivoPrincipal"
                      className="form-select"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#1d1d1f",
                        fontWeight: 600,
                        borderRadius: "12px",
                        padding: "0.8rem 1rem",
                        border: "2px solid rgba(39, 174, 96, 0.35)",
                        cursor: "pointer",
                      }}
                      value={profileForm?.objetivoPrincipal || ""}
                      onChange={handleProfileChange}
                    >
                      <option value="">Selecciona un objetivo clínico...</option>
                      <option value="Pérdida de Grasa">
                        ⚖️ Pérdida de Grasa Corporal
                      </option>
                      <option value="Ganancia Muscular">
                        💪 Aumento de Masa Muscular
                      </option>
                      <option value="Mantenimiento">
                        🥗 Mantenimiento y Reeducación
                      </option>
                      <option value="Rendimiento Deportivo">
                        ⚡ Rendimiento Deportivo
                      </option>
                      <option value="Salud Clínica">
                        🩺 Control Metabólico / Salud Clínica
                      </option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted fw-bold small text-uppercase tracking-tight mb-1">
                    Fecha de Nacimiento (No editable)
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    className="form-control apple-input opacity-50"
                    value={profileForm?.fechaNacimiento || ""}
                    disabled
                    readOnly
                  />
                </div>

                {/* CAMBIO DE CONTRASEÑA CON REQUISITOS EXPLÍCITOS FUERA DEL PLACEHOLDER */}
                <div className="mt-4 pt-3 border-top">
                  {!isChangingPassword ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(true);
                        setPasswordError("");
                      }}
                      className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold small w-100"
                    >
                      🔒 Cambiar contraseña de acceso
                    </button>
                  ) : (
                    <div className="p-4 rounded-4 bg-white border shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bolder text-dark mb-0">
                          Actualizar Contraseña
                        </h6>
                        <button
                          type="button"
                          onClick={resetPasswordFields}
                          className="btn btn-sm btn-light rounded-pill px-3 fw-semibold"
                        >
                          Cancelar cambio
                        </button>
                      </div>

                      {passwordError && (
                        <div
                          className="alert alert-danger py-2 px-3 small mb-3 border-0 rounded-3"
                          role="alert"
                        >
                          ⚠️ {passwordError}
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label text-dark fw-semibold small mb-1">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          className="form-control apple-input"
                          placeholder="Escribe tu contraseña actual"
                          value={passwordActual}
                          onChange={(e) => {
                            setPasswordActual(e.target.value);
                            setPasswordError("");
                          }}
                        />
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-dark fw-semibold small mb-1">
                            Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            className="form-control apple-input"
                            placeholder="Escribe la nueva clave"
                            value={nuevaPassword}
                            onChange={(e) => {
                              setNuevaPassword(e.target.value);
                              setPasswordError("");
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark fw-semibold small mb-1">
                            Confirmar Contraseña
                          </label>
                          <input
                            type="password"
                            className="form-control apple-input"
                            placeholder="Repite la nueva clave"
                            value={confirmarPassword}
                            onChange={(e) => {
                              setConfirmarPassword(e.target.value);
                              setPasswordError("");
                            }}
                          />
                        </div>
                      </div>

                      {/* Regla de accesibilidad explícita y permanente */}
                      <div className="mt-3 p-2 rounded-3 bg-light border text-muted small">
                        ℹ️ <strong>Requisitos de seguridad:</strong> La nueva
                        contraseña debe tener al menos{" "}
                        <strong>9 caracteres</strong>, incluir una{" "}
                        <strong>letra minúscula</strong> y al menos{" "}
                        <strong>un número</strong>.
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-panel p-4 p-md-5 rounded-5 border-0 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bolder text-dark tracking-tight mb-0">
                  Documentos Recientes
                </h4>
                <button
                  onClick={() => setActiveTab("examenes")}
                  className="btn btn-sm btn-link text-success text-decoration-none fw-bold p-0"
                >
                  Ver todos →
                </button>
              </div>

              {examenes.length === 0 ? (
                <p className="text-muted small">
                  No has subido exámenes recientemente.
                </p>
              ) : (
                <div className="d-flex flex-column gap-2 mb-4">
                  {examenes.slice(0, 3).map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-4 bg-white border d-flex justify-content-between align-items-center"
                    >
                      <div className="text-truncate me-2">
                        <div className="fw-bold text-dark small text-truncate">
                          📄 {ex.nombre}
                        </div>
                        <small className="text-muted">{ex.fechaSubida}</small>
                      </div>
                      <span
                        className={`badge rounded-pill ${
                          ex.estado === "Revisado"
                            ? "bg-success-subtle text-success"
                            : "bg-warning-subtle text-dark"
                        }`}
                      >
                        {ex.estado}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-4 bg-warning-subtle border border-warning border-opacity-25 d-flex align-items-start gap-3">
              <span className="fs-3">⚠️</span>
              <div className="small text-dark">
                <strong>Recordatorio Clínico:</strong> Sube tus análisis de
                laboratorio al menos 48 horas antes de tu próximo control para
                que tu nutricionista los revise con anticipación.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCitas = () => (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
      style={{
        minHeight: "55vh",
        animation: "fadeSlideUp 0.4s var(--ease-spring)",
      }}
    >
      {!isBookingCita ? (
        <>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
              <h4 className="fw-bolder text-dark mb-1 tracking-tight">
                Gestión de Citas Médicas
              </h4>
              <p className="text-muted small mb-0">
                Revisa tus próximas visitas o programa una nueva sesión.
              </p>
            </div>
            <button
              onClick={() => setIsBookingCita(true)}
              className="btn-kinetic-health py-2 px-4 border-0 shadow-sm"
            >
              <span>+ Agendar Nueva Cita</span>
            </button>
          </div>

          {citas.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-2">📅</div>
              <h6 className="fw-bold text-dark">No tienes citas registradas</h6>
              <p className="text-muted small">
                Agenda tu primera consulta nutricional con nuestro equipo.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {citas.map((cita) => (
                <div
                  key={cita.id}
                  className={`p-4 rounded-4 border d-flex flex-column flex-md-row justify-content-between align-items-md-center transition-all ${
                    cita.estado === "Programada"
                      ? "bg-white border-success border-2 shadow-sm"
                      : "bg-light opacity-75"
                  }`}
                >
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <h5 className="fw-bold text-dark mb-0">{cita.tipo}</h5>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          cita.estado === "Programada"
                            ? "bg-success"
                            : cita.estado === "Cancelada"
                              ? "bg-danger"
                              : "bg-secondary"
                        }`}
                      >
                        {cita.estado}
                      </span>
                    </div>
                    <p className="text-muted small mb-0">
                      📅 <strong>{cita.fecha}</strong> a las{" "}
                      <strong>{cita.hora} hrs</strong> • 👩‍⚕️ {cita.profesional}
                    </p>
                  </div>
                  {cita.estado === "Programada" && (
                    <div className="mt-3 mt-md-0">
                      <button
                        onClick={() => handleCancelarCita(cita.id)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-bold"
                      >
                        Cancelar Cita
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bolder text-dark tracking-tight mb-0">
              Programar Nueva Consulta
            </h4>
            <button
              onClick={() => setIsBookingCita(false)}
              className="btn btn-light rounded-pill px-3 py-2 fw-semibold small"
            >
              ← Volver al listado
            </button>
          </div>
          <form
            onSubmit={handleBookingSubmit}
            className="p-4 rounded-4 bg-white border shadow-sm"
          >
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label text-dark fw-bold small text-uppercase tracking-tight">
                  Modalidad o Servicio
                </label>
                <select
                  name="tipo"
                  className="form-select apple-input fw-semibold"
                  value={bookingForm.tipo}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="Consulta Presencial">
                    Consulta Presencial (Clínica Temuco)
                  </option>
                  <option value="Control Telemedicina">
                    Control por Telemedicina (Online)
                  </option>
                  {compras.map((c) => (
                    <option key={c.id} value={c.nombre}>
                      🛍️ Servicio Adquirido: {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-dark fw-bold small text-uppercase tracking-tight">
                  Nutricionista Tratante
                </label>
                <select
                  name="profesional"
                  className="form-select apple-input fw-semibold"
                  value={bookingForm.profesional}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="Nut. Andrea Valdés">
                    Nut. Andrea Valdés (Clínica y Metabolismo)
                  </option>
                  <option value="Nut. Roberto Muñoz">
                    Nut. Roberto Muñoz (Deportiva y Composición)
                  </option>
                  <option value="Nut. Camila Soto">
                    Nut. Camila Soto (Salud Digestiva y Vegana)
                  </option>
                </select>
              </div>
            </div>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label text-dark fw-bold small text-uppercase tracking-tight">
                  Fecha Solicitada
                </label>
                <input
                  type="date"
                  name="fecha"
                  className="form-control apple-input"
                  value={bookingForm.fecha}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-dark fw-bold small text-uppercase tracking-tight">
                  Hora Preferida
                </label>
                <input
                  type="time"
                  name="hora"
                  className="form-control apple-input"
                  value={bookingForm.hora}
                  onChange={handleBookingChange}
                  required
                />
              </div>
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-success btn-lg rounded-pill fw-bold px-5 shadow-sm"
              >
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  const renderPlan = () => {
    if (!plan || !plan.macros) {
      return (
        <div className="glass-panel p-5 rounded-5 text-center">
          <div className="fs-1 mb-3">🥗</div>
          <h5 className="fw-bold text-dark">Aún no tienes una pauta asignada</h5>
          <p className="text-muted small">
            Tu nutricionista cargará tu plan tras tu primera sesión de evaluación.
          </p>
        </div>
      );
    }

    const totalComidas = plan.comidas?.length || 1;
    const progresoDia = Math.round(
      (comidasCompletadas.length / totalComidas) * 100,
    );

    return (
      <div
        className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
        style={{
          minHeight: "55vh",
          animation: "fadeSlideUp 0.4s var(--ease-spring)",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold mb-2">
              {plan.caloriasDiarias} kcal diarias •{" "}
              {usuario?.objetivoPrincipal || plan.objetivo}
            </span>
            <h4 className="fw-bolder text-dark mb-0 tracking-tight">
              Pauta Alimentaria Activa
            </h4>
          </div>
          <button
            onClick={handleDescargarPDF}
            className="btn btn-dark rounded-pill px-4 py-2 fw-bold small shadow-sm"
          >
            📥 Descargar Pauta (.TXT)
          </button>
        </div>

        {/* Distribución de Macronutrientes */}
        <div className="row g-3 mb-4">
          {plan.macros.map((macro, idx) => (
            <div key={idx} className="col-md-4">
              <div className="p-3 rounded-4 bg-white border shadow-sm text-center">
                <p className="text-muted small fw-bold text-uppercase tracking-tight mb-1">
                  {macro.nombre}
                </p>
                <h4 className="fw-bolder text-dark mb-2">
                  {macro.gramos}g{" "}
                  <span className="fs-6 text-muted fw-normal">
                    ({macro.porcentaje}%)
                  </span>
                </h4>
                <div className="progress rounded-pill" style={{ height: "8px" }}>
                  <div
                    className={`progress-bar bg-${macro.color}`}
                    style={{ width: `${macro.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de Adherencia Diaria Interactiva */}
        <div className="p-3 rounded-4 bg-success-subtle border border-success border-opacity-25 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-success small">
              ✅ Tu cumplimiento de hoy ({comidasCompletadas.length} de{" "}
              {totalComidas} comidas)
            </span>
            <span className="fw-bolder text-success small">{progresoDia}%</span>
          </div>
          <div
            className="progress rounded-pill bg-white"
            style={{ height: "10px" }}
          >
            <div
              className="progress-bar bg-success transition-all"
              style={{ width: `${progresoDia}%` }}
            ></div>
          </div>
        </div>

        <h6 className="fw-bolder text-dark text-uppercase tracking-tight small mb-3">
          Estructura Diaria (Marca tus comidas realizadas)
        </h6>
        <div className="d-flex flex-column gap-3">
          {plan.comidas.map((comida) => {
            const completada = comidasCompletadas.includes(comida.id);
            return (
              <div
                key={comida.id}
                onClick={() => toggleComidaCompletada(comida.id)}
                style={{ cursor: "pointer" }}
                className={`p-4 rounded-4 border transition-all d-flex align-items-start gap-3 ${
                  completada
                    ? "bg-success-subtle border-success"
                    : "bg-white hover-lift"
                }`}
              >
                <input
                  type="checkbox"
                  className="form-check-input mt-1"
                  checked={completada}
                  onChange={() => {}}
                  style={{ width: "1.3rem", height: "1.3rem", cursor: "pointer" }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-2">
                    <span
                      className={`fw-bolder fs-6 ${
                        completada
                          ? "text-decoration-line-through text-success"
                          : "text-dark"
                      }`}
                    >
                      {comida.tipo}
                    </span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-1">
                      🕒 {comida.horario}
                    </span>
                  </div>
                  <p
                    className={`small mb-0 ${
                      completada ? "text-muted" : "text-secondary"
                    }`}
                  >
                    {comida.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEvolucion = () => {
    const pesoDiferencia =
      metricas.length >= 2
        ? (metricas[0].peso - metricas[metricas.length - 1].peso).toFixed(1)
        : "0.0";

    return (
      <div
        className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
        style={{
          minHeight: "55vh",
          animation: "fadeSlideUp 0.4s var(--ease-spring)",
        }}
      >
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
          <div>
            <h4 className="fw-bolder text-dark mb-1 tracking-tight">
              Evolución y Biometría
            </h4>
            <p className="text-muted small mb-0">
               Monitorea tus cambios de composición corporal a lo largo del tratamiento.
            </p>
          </div>
          <button
            onClick={() => setIsAddingMetrica(!isAddingMetrica)}
            className="btn-kinetic-health py-2 px-4 border-0 shadow-sm"
          >
            {isAddingMetrica ? "Cancelar" : "+ Registrar Control"}
          </button>
        </div>

        {/* Formulario para añadir nueva métrica biométrica */}
        {isAddingMetrica && (
          <form
            onSubmit={handleAddMetricaSubmit}
            className="p-4 rounded-4 bg-white border shadow-sm mb-4"
          >
            <h6 className="fw-bold text-dark mb-3">
              Nuevo Registro de Control Corporal
            </h6>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control apple-input"
                  placeholder="Ej: 69.5"
                  value={nuevaMetrica.peso}
                  onChange={(e) =>
                    setNuevaMetrica({ ...nuevaMetrica, peso: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  % Grasa Corporal
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control apple-input"
                  placeholder="Ej: 21.5"
                  value={nuevaMetrica.grasa}
                  onChange={(e) =>
                    setNuevaMetrica({ ...nuevaMetrica, grasa: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Masa Muscular (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control apple-input"
                  placeholder="Ej: 30.2"
                  value={nuevaMetrica.musculo}
                  onChange={(e) =>
                    setNuevaMetrica({
                      ...nuevaMetrica,
                      musculo: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-success rounded-pill px-4 py-2 fw-bold small"
              >
                Guardar Medición
              </button>
            </div>
          </form>
        )}

        {metricas.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-2">📊</div>
            <p className="text-muted">Aún no existen mediciones registradas.</p>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-sm-4">
                <div className="p-4 rounded-4 bg-success text-white shadow-sm">
                  <p className="small mb-1 opacity-75 fw-semibold text-uppercase">
                    Variación Total
                  </p>
                  <h3 className="fw-bolder mb-0">
                    {parseFloat(pesoDiferencia) > 0
                      ? `+${pesoDiferencia}`
                      : pesoDiferencia}{" "}
                    kg
                  </h3>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-4 rounded-4 bg-white border shadow-sm">
                  <p className="small text-muted fw-semibold mb-1 text-uppercase">
                    % Grasa Actual
                  </p>
                  <h3 className="fw-bolder text-dark mb-0">
                    {metricas[0].grasa}%
                  </h3>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-4 rounded-4 bg-white border shadow-sm">
                  <p className="small text-muted fw-semibold mb-1 text-uppercase">
                    Masa Muscular
                  </p>
                  <h3 className="fw-bolder text-success mb-0">
                    {metricas[0].musculo} kg
                  </h3>
                </div>
              </div>
            </div>

            <div className="table-responsive rounded-4 border bg-white shadow-sm overflow-hidden">
              <table className="table table-hover align-middle text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 text-uppercase small text-muted">
                      Fecha de Control
                    </th>
                    <th className="py-3 text-uppercase small text-muted">
                      Peso (kg)
                    </th>
                    <th className="py-3 text-uppercase small text-muted">
                      % Grasa Corporal
                    </th>
                    <th className="py-3 text-uppercase small text-muted">
                      Masa Muscular (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metricas.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 fw-bold text-dark">{m.fecha}</td>
                      <td className="py-3 fw-semibold">{m.peso} kg</td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark border rounded-pill px-3">
                          {m.grasa}%
                        </span>
                      </td>
                      <td className="py-3 text-success fw-bold">
                        {m.musculo} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderExamenes = () => (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
      style={{
        minHeight: "55vh",
        animation: "fadeSlideUp 0.4s var(--ease-spring)",
      }}
    >
      <div className="mb-4">
        <h4 className="fw-bolder text-dark mb-1 tracking-tight">
          Repositorio de Exámenes Médicos
        </h4>
        <p className="text-muted small mb-0">
          Carga tus resultados de laboratorio para el análisis previo a tu consulta.
        </p>
      </div>

      <div
        onClick={triggerFileInput}
        style={{ cursor: "pointer", borderStyle: "dashed", borderWidth: "2px" }}
        className="p-5 mb-4 bg-white rounded-5 text-center border-success hover-lift transition-all"
      >
        <div className="fs-1 mb-2">📥</div>
        <h5 className="fw-bold text-dark mb-1">
          Haz clic aquí para subir tus exámenes
        </h5>
        <p className="text-muted small mb-3">
          Formatos admitidos: PDF, JPG o PNG (Máximo 5MB por archivo)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="application/pdf, image/jpeg, image/png"
          onChange={handleFileChange}
        />
        <span className="btn btn-success rounded-pill px-4 py-2 fw-bold small shadow-sm">
          Seleccionar Documento
        </span>
      </div>

      <h6 className="fw-bolder text-dark text-uppercase tracking-tight small mb-3">
        Historial de Documentos Subidos ({examenes.length})
      </h6>
      {examenes.length === 0 ? (
        <div className="text-center py-4 bg-white rounded-4 border">
          <p className="text-muted small mb-0">
            No hay exámenes cargados en tu ficha clínica.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {examenes.map((examen) => (
            <div
              key={examen.id}
              className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-3 px-4 bg-white border rounded-4 shadow-sm gap-3"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="fs-2">🩺</div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">{examen.nombre}</h6>
                  <small className="text-muted">
                    Cargado el {examen.fechaSubida}
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 align-self-end align-self-sm-center">
                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    examen.estado === "Revisado"
                      ? "bg-success-subtle text-success"
                      : "bg-warning-subtle text-dark"
                  }`}
                >
                  {examen.estado === "Revisado"
                    ? "✓ Revisado por Nutricionista"
                    : "⏳ Pendiente de revisión"}
                </span>
                <button
                  type="button"
                  onClick={() => handleEliminarExamen(examen.id, examen.nombre)}
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  title="Eliminar documento"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCompras = () => (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
      style={{
        minHeight: "55vh",
        animation: "fadeSlideUp 0.4s var(--ease-spring)",
      }}
    >
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">
            Mis Planes y Servicios Adquiridos
          </h4>
          <p className="text-muted small mb-0">
            Administra tus prestaciones contratadas y agenda tus sesiones correspondientes.
          </p>
        </div>
        <Link
          to="/metodologia#catalogo"
          className="btn-kinetic-secondary py-2 px-4 text-decoration-none"
        >
          Explorar Catálogo →
        </Link>
      </div>

      {compras.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-5 border">
          <div className="fs-1 mb-3">🛍️</div>
          <h5 className="fw-bold text-dark mb-2">
            Aún no tienes servicios contratados
          </h5>
          <p className="text-muted small mb-4">
            Explora nuestro catálogo clínico para adquirir tu evaluación o plan nutricional.
          </p>
          <Link
            to="/metodologia#catalogo"
            className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm"
          >
            Ir al Catálogo Clínico
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="p-4 rounded-4 bg-white border shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 hover-lift"
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h5 className="fw-bolder text-dark mb-0">{compra.nombre}</h5>
                  <span
                    className={`badge rounded-pill px-3 ${
                      compra.estado === "Activo" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {compra.estado}
                  </span>
                </div>
                <p className="text-muted small mb-0">
                  Adquirido el <strong>{compra.fechaCompra}</strong> • Monto pagado:{" "}
                  <strong className="text-success">
                    {formatPrice(compra.monto)}
                  </strong>
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => handleAgendarDesdeCompra(compra.nombre)}
                  className="btn btn-dark rounded-pill px-4 py-2 fw-bold small shadow-sm"
                >
                  📅 Agendar Hora de este Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading)
    return (
      <main className="app-wrapper flex-grow-1 d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="ambient-glow-health"></div>
        <div className="glass-panel p-5 rounded-5 shadow-glass text-center">
          <div
            className="spinner-border text-success mb-3"
            role="status"
            style={{ width: "2.5rem", height: "2.5rem" }}
          ></div>
          <p className="text-dark fw-bold mb-0 tracking-tight">
            Sincronizando Portal del Paciente...
          </p>
        </div>
      </main>
    );

  if (!usuario) return <></>;

  return (
    <main className="app-wrapper position-relative py-4 py-lg-5">
      <div className="ambient-glow-health"></div>

      {/* Notificación Flotante Superior */}
      {notification && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x p-3"
          style={{
            zIndex: 1100,
            marginTop: "75px",
            animation: "fadeSlideUp 0.3s var(--ease-spring)",
          }}
        >
          <div
            className={`glass-panel-small px-4 py-3 rounded-pill shadow-glass d-flex align-items-center gap-3 border ${
              notification.type === "danger"
                ? "border-danger"
                : notification.type === "warning"
                  ? "border-warning"
                  : "border-success"
            }`}
            role="alert"
          >
            <span>
              {notification.type === "success"
                ? "✅"
                : notification.type === "danger"
                  ? "⛔"
                  : "⚠️"}
            </span>
            <span className="fw-bold text-dark small">
              {notification.message}
            </span>
            <button
              type="button"
              className="btn-close"
              style={{ fontSize: "0.75rem" }}
              onClick={() => setNotification(null)}
              aria-label="Cerrar notificación"
            ></button>
          </div>
        </div>
      )}

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* HEADER RESPONSIVO */}
        <div
          className="p-4 p-md-5 rounded-5 shadow-glass mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
          style={{
            background: "linear-gradient(135deg, #198754 0%, #20c997 100%)",
            color: "white",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            {/* Avatar visible en el banner en pantallas móviles */}
            <div
              className="d-lg-none rounded-circle d-inline-flex justify-content-center align-items-center fw-bold shadow overflow-hidden flex-shrink-0"
              style={{
                width: "60px",
                height: "60px",
                fontSize: "1.4rem",
                backgroundColor: usuario?.fotoPerfil
                  ? "transparent"
                  : "rgba(255,255,255,0.2)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.6)",
              }}
            >
              {usuario?.fotoPerfil ? (
                <img
                  src={usuario.fotoPerfil}
                  alt="Perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                usuario.nombre.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="fw-bolder display-6 mb-1 tracking-tight">
                ¡Hola, {usuario.nombre.split(" ")[0]}!
              </h2>
              <p className="mb-0 opacity-90 small fw-medium">
                Bienvenido a tu espacio clínico personalizado en NutriVida.
              </p>
            </div>
          </div>
          <div className="d-none d-md-flex align-items-center gap-2 bg-white bg-opacity-25 px-4 py-2 rounded-pill">
            <span>🌱</span>
            <span className="small fw-bold">Ficha Clínica Activa</span>
          </div>
        </div>

        {/* BARRA DE NAVEGACIÓN HORIZONTAL EXCLUSIVA PARA MÓVILES Y TABLETS (< 992px) */}
        <div className="d-lg-none mb-4">
          <div
            className="glass-panel p-2 rounded-pill shadow-sm d-flex flex-row flex-nowrap overflow-x-auto gap-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsBookingCita(false);
                  }}
                  className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap d-flex align-items-center gap-2 flex-shrink-0 transition-all border-0 ${
                    active ? "bg-success text-white shadow-sm" : "text-dark"
                  }`}
                  style={{ fontSize: "0.9rem" }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="row g-4">
          {/* SIDEBAR VERTICAL EXCLUSIVO PARA ESCRITORIO (>= 992px) */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div
              className="glass-card p-4 rounded-5 border-0 sticky-lg-top"
              style={{ top: "110px" }}
            >
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex justify-content-center align-items-center fw-bold mb-3 shadow-glass overflow-hidden"
                  style={{
                    width: "96px",
                    height: "96px",
                    fontSize: "2.2rem",
                    backgroundColor: usuario?.fotoPerfil
                      ? "transparent"
                      : "#198754",
                    color: "white",
                    border: "3px solid white",
                  }}
                >
                  {usuario?.fotoPerfil ? (
                    <img
                      src={usuario.fotoPerfil}
                      alt="Perfil"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    usuario.nombre.substring(0, 2).toUpperCase()
                  )}
                </div>
                <h5 className="fw-bolder text-dark mb-1 tracking-tight">
                  {usuario.nombre}
                </h5>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold small">
                  Paciente Activo
                </span>
              </div>

              <hr className="text-muted my-3 opacity-10" />

              <div className="d-flex flex-column gap-2">
                {navItems.map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsBookingCita(false);
                      }}
                      className={`btn rounded-4 px-3 py-3 fw-bold text-start d-flex align-items-center gap-3 transition-all border-0 ${
                        active
                          ? "bg-success text-white shadow-sm"
                          : "text-dark bg-transparent hover-lift"
                      }`}
                    >
                      <span className="fs-5">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CONTENIDO DE LA PESTAÑA ACTIVA */}
          <section className="col-12 col-lg-9">
            {activeTab === "resumen" && renderResumen()}
            {activeTab === "citas" && renderCitas()}
            {activeTab === "plan" && renderPlan()}
            {activeTab === "evolucion" && renderEvolucion()}
            {activeTab === "examenes" && renderExamenes()}
            {activeTab === "compras" && renderCompras()}
          </section>
        </div>
      </div>
    </main>
  );
}