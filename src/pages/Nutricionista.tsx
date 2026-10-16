import { useEffect, useRef, useState, type JSX } from "react";
import { useNavigate } from "react-router";
import AdminStatCard from "../components/admin/AdminStatCard";
import NutricionistaSidebar, {
  type nutriTab,
} from "../components/nutricionista/NutriSidebar";
import NutricionistaProductsTab from "../components/nutricionista/NutricionistaProductsTab";
import NutricionistaCategoriesTab from "../components/nutricionista/NutricionistaCategoriesTab";

import type {
    Categoria,
    Metrica,
    Examen,
    PlanNutricional,
    Usuario,
    Servicio
} from "../types/index";
import { StorageUsuario } from "../services/storageUsuario";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";
import { PlanService } from "../services/planService";

interface CitaNormalizada {
  id: string;
  pacienteNombre: string;
  pacienteEmail: string;
  servicioNombre: string;
  profesional: string;
  fecha: string;
  hora: string;
  estado: "Pendiente" | "Programada" | "Confirmada" | "Completada" | "Cancelada";
}

export type NutricionistaTab = nutriTab;

export default function Nutricionista(): JSX.Element {
  const [activeTab, setActiveTab] = useState<NutricionistaTab>("dashboard");
  const activeContentRef = useRef<HTMLDivElement>(null);
  const [contentMinHeight, setContentMinHeight] = useState(0);
  const navigate = useNavigate();

  const [nutricionistaActual] = useState<Usuario | null>(() => {
    const sesion = StorageUsuario.getUsuarioSesion();
    return sesion?.rol === "nutricionista" ? sesion : null;
  });

  useEffect(() => {
    const sesion = StorageUsuario.getUsuarioSesion();
    if (!sesion || sesion.rol !== "nutricionista") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const [notificacion, setNotificacion] = useState<{
    texto: string;
    tipo: "info" | "success" | "danger";
  } | null>(null);

  const mostrarNotificacion = (
    texto: string,
    tipo: "info" | "success" | "danger" = "info",
  ) => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3800);
  };

  // =========================================================
  // 1. GESTIÓN DE CATEGORÍAS
  // =========================================================
  const [categorias, setCategorias] = useState<Categoria[]>(() =>
    StorageCategorias.getCategorias(),
  );

  const cargarCategorias = () => {
    setCategorias(StorageCategorias.getCategorias());
  };

  const handleGuardarCategoria = (
    datos: Omit<Categoria, "id" | "serviciosAsociados">,
    categoriaEditar: Categoria | null,
  ): boolean => {
    if (categoriaEditar) {
      const res = StorageCategorias.updateCategoria({
        ...categoriaEditar,
        ...datos,
      });
      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return false;
      }
      mostrarNotificacion("Categoría actualizada correctamente.", "success");
    } else {
      const res = StorageCategorias.crearCategoria(datos);
      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return false;
      }
      mostrarNotificacion("Nueva categoría creada.", "success");
    }
    cargarCategorias();
    return true;
  };

  const eliminarCategoria = (categoria: Categoria) => {
    StorageCategorias.deleteCategoria(categoria.id);
    cargarCategorias();
    mostrarNotificacion(`Categoría "${categoria.nombre}" eliminada.`, "success");
  };

  // =========================================================
  // 2. GESTIÓN DE SERVICIOS
  // =========================================================
  const [servicios, setServicios] = useState<Servicio[]>(() =>
    StorageServicios.getServicios(),
  );

  const cargarServicios = () => {
    setServicios(StorageServicios.getServicios());
  };

  const handleGuardarServicio = (
    datos: Omit<Servicio, "id" | "estado">,
    servicioAEditar: Servicio | null,
  ): boolean => {
    const categoriaEncontrada = categorias.find((c) => c.id === datos.categoriaId);
    const nombreCategoria = categoriaEncontrada ? categoriaEncontrada.nombre : "General";

    if (servicioAEditar) {
      const res = StorageServicios.updateServicio({
        ...servicioAEditar,
        ...datos,
        categoriaNombre: nombreCategoria,
      });
      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return false;
      }
      mostrarNotificacion("Plan o servicio actualizado.", "success");
    } else {
      const res = StorageServicios.crearServicio({
        ...datos,
        categoriaNombre: nombreCategoria,
        estado: "Activo",
      });
      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return false;
      }
      mostrarNotificacion("Nuevo plan publicado en el catálogo.", "success");
    }
    cargarServicios();
    cargarCategorias();
    return true;
  };

  const handleToggleEstado = (id: string) => {
    StorageServicios.toggleEstado(id);
    cargarServicios();
    mostrarNotificacion("Visibilidad del servicio actualizada.", "info");
  };

  // =========================================================
  // 3. DATOS DE USUARIOS Y PACIENTES
  // =========================================================
  const [pacientes, setPacientes] = useState<Usuario[]>(() =>
    StorageUsuario.getUsuarios().filter((u) => u.rol === "usuario"),
  );

  const cargarDatosClinicos = () => {
    const todosUsuarios = StorageUsuario.getUsuarios();
    setPacientes(todosUsuarios.filter((u) => u.rol === "usuario"));
    setExamenes(PlanService.getExamenes());
    setPlanActivo(PlanService.getPlan());
    setMetricasPaciente(PlanService.getMetricas());
  };

  const cambiarTab = (tab: NutricionistaTab) => {
    if (tab !== activeTab) {
      const currentHeight = activeContentRef.current?.getBoundingClientRect().height ?? 0;
      setContentMinHeight((height) => Math.max(height, currentHeight));
      cargarDatosClinicos();
    }
    setActiveTab(tab);
  };

  // =========================================================
  // 4. GESTIÓN DE AGENDA Y CITAS
  // =========================================================
  const [busquedaCitas, setBusquedaCitas] = useState("");
  const [filtroEstadoCita, setFiltroEstadoCita] = useState<string>("TODOS");
  const [isCreatingCita, setIsCreatingCita] = useState(false);
  
  const [nuevaCitaForm, setNuevaCitaForm] = useState({
    pacienteNombre: "",
    pacienteEmail: "",
    servicioNombre: "Consulta Presencial",
    fecha: "",
    hora: "",
  });

  const obtenerCitasNormalizadas = (): CitaNormalizada[] => {
    const raw = localStorage.getItem("db_citas");
    const pacienteDefault = pacientes[0];

    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.map((c: Record<string, string>) => ({
        id: c.id || `CITA-${Date.now()}`,
        pacienteNombre: c.pacienteNombre || pacienteDefault?.nombre || "Paciente Registrado",
        pacienteEmail: c.pacienteEmail || pacienteDefault?.email || "paciente@gmail.com",
        servicioNombre: c.servicioNombre || c.tipo || "Consulta Clínica",
        profesional: c.profesional || nutricionistaActual?.nombre || "Staff NutriVida",
        fecha: c.fecha || "Por definir",
        hora: c.hora || "--:--",
        estado: (c.estado as CitaNormalizada["estado"]) || "Programada",
      }));
    } catch {
      return [];
    }
  };

  const [citas, setCitas] = useState<CitaNormalizada[]>(obtenerCitasNormalizadas);

  const guardarCitasEnStorage = (nuevasCitas: CitaNormalizada[]) => {
    setCitas(nuevasCitas);
    const formatoCompatible = nuevasCitas.map((c) => ({
      ...c,
      tipo: c.servicioNombre,
    }));
    localStorage.setItem("db_citas", JSON.stringify(formatoCompatible));
  };

  const cambiarEstadoCita = (id: string, nuevoEstado: CitaNormalizada["estado"]) => {
    const actualizadas = citas.map((c) =>
      c.id === id ? { ...c, estado: nuevoEstado } : c,
    );
    guardarCitasEnStorage(actualizadas);
    mostrarNotificacion(`Cita marcada como ${nuevoEstado}.`, "success");
  };

  const handleCrearCitaManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // VALIDACIÓN ESTRICTA: El paciente debe existir en la BD
    const pacienteValido = pacientes.find(p => p.email === nuevaCitaForm.pacienteEmail);
    if (!pacienteValido) {
      mostrarNotificacion("Error de integridad: Debes seleccionar un paciente registrado.", "danger");
      return;
    }

    const nueva: CitaNormalizada = {
      id: `c-${Date.now()}`,
      pacienteNombre: pacienteValido.nombre,
      pacienteEmail: pacienteValido.email,
      servicioNombre: nuevaCitaForm.servicioNombre,
      profesional: nutricionistaActual?.nombre || "Nutricionista",
      fecha: nuevaCitaForm.fecha,
      hora: nuevaCitaForm.hora,
      estado: "Confirmada",
    };

    guardarCitasEnStorage([nueva, ...citas]);
    setIsCreatingCita(false);
    setNuevaCitaForm({
      pacienteNombre: "",
      pacienteEmail: "",
      servicioNombre: "Consulta Presencial",
      fecha: "",
      hora: "",
    });
    mostrarNotificacion("Cita agendada correctamente en la plataforma.", "success");
  };

  const citasFiltradas = citas.filter((c) => {
    const termino = busquedaCitas.toLowerCase();
    const coincideTexto =
      c.pacienteNombre.toLowerCase().includes(termino) ||
      c.pacienteEmail.toLowerCase().includes(termino) ||
      c.servicioNombre.toLowerCase().includes(termino);

    const coincideEstado =
      filtroEstadoCita === "TODOS" ||
      (filtroEstadoCita === "ACTIVAS" &&
        (c.estado === "Pendiente" || c.estado === "Programada" || c.estado === "Confirmada")) ||
      c.estado === filtroEstadoCita;

    return coincideTexto && coincideEstado;
  });

  // =========================================================
  // 5. MÓDULO CLÍNICO (FICHAS, PAUTAS Y LABORATORIO)
  // =========================================================
  const [examenes, setExamenes] = useState<Examen[]>(() => PlanService.getExamenes());
  const [planActivo, setPlanActivo] = useState<PlanNutricional | null>(() => PlanService.getPlan());
  const [metricasPaciente, setMetricasPaciente] = useState<Metrica[]>(() => PlanService.getMetricas());
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  const [nuevaComida, setNuevaComida] = useState({
    horario: "08:30",
    tipo: "Desayuno",
    descripcion: "",
  });

  const [nuevoControlClinico, setNuevoControlClinico] = useState({
    peso: "",
    grasa: "",
    musculo: "",
  });

  const handleToggleEstadoExamen = (id: string) => {
    const actualizados: Examen[] = examenes.map((ex) =>
      ex.id === id ? { ...ex, estado: ex.estado === "Revisado" ? "Pendiente" : "Revisado" } : ex
    );
    setExamenes(actualizados);
    localStorage.setItem("db_examenes", JSON.stringify(actualizados));
    mostrarNotificacion("Estado de revisión del examen actualizado.", "success");
  };

  const handleGuardarPlanNutricional = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!planActivo) return;
    localStorage.setItem("db_plan", JSON.stringify(planActivo));
    setIsEditingPlan(false);
    mostrarNotificacion("Pauta alimentaria sincronizada con el Portal del Paciente.", "success");
  };

  const handleAgregarComidaPlan = () => {
    if (!planActivo || !nuevaComida.descripcion.trim()) return;
    const comidaObj = {
      id: `com-${Date.now()}`,
      horario: nuevaComida.horario,
      tipo: nuevaComida.tipo,
      descripcion: nuevaComida.descripcion.trim(),
    };
    const actualizado: PlanNutricional = {
      ...planActivo,
      comidas: [...(planActivo.comidas || []), comidaObj],
    };
    setPlanActivo(actualizado);
    localStorage.setItem("db_plan", JSON.stringify(actualizado));
    setNuevaComida({ horario: "13:30", tipo: "Almuerzo", descripcion: "" });
    mostrarNotificacion("Tiempo de comida añadido a la pauta.", "success");
  };

  const handleEliminarComidaPlan = (idComida: string) => {
    if (!planActivo) return;
    const actualizado: PlanNutricional = {
      ...planActivo,
      comidas: planActivo.comidas.filter((c) => c.id !== idComida),
    };
    setPlanActivo(actualizado);
    localStorage.setItem("db_plan", JSON.stringify(actualizado));
    mostrarNotificacion("Tiempo de comida eliminado de la pauta.", "info");
  };

  const handleRegistrarAntropometria = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const peso = parseFloat(nuevoControlClinico.peso);
    const grasa = parseFloat(nuevoControlClinico.grasa);
    const musculo = parseFloat(nuevoControlClinico.musculo);
    if (!peso || !grasa || !musculo) return;

    const nuevaMetrica: Metrica = {
      id: `m-${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" }),
      peso,
      grasa,
      musculo,
    };

    const actualizadas = [nuevaMetrica, ...metricasPaciente];
    setMetricasPaciente(actualizadas);
    localStorage.setItem("db_metricas", JSON.stringify(actualizadas));
    setNuevoControlClinico({ peso: "", grasa: "", musculo: "" });
    mostrarNotificacion("Medición InBody registrada en la evolución del paciente.", "success");
  };

  const citasPendientesCount = citas.filter((c) => c.estado === "Pendiente" || c.estado === "Programada").length;
  const examenesPendientesCount = examenes.filter((e) => e.estado === "Pendiente").length;

  // =========================================================
  // RENDERS SECUNDARIOS (SIN ANIMACIONES DOBLES PARA EVITAR SALTOS)
  // =========================================================
  const renderDashboard = () => {
    const totalPlanesActivos = servicios.filter((s) => s.estado === "Activo").length;
    return (
      <>
        <div className="row g-4 mb-4">
          <AdminStatCard title="Planes Publicados" value={totalPlanesActivos} icon="🥗" theme="success" />
          <AdminStatCard title="Consultas Activas" value={citasPendientesCount} icon="📅" theme="warning" />
          <AdminStatCard title="Exámenes por Revisar" value={examenesPendientesCount} icon="🔬" theme="info" />
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="glass-panel p-4 rounded-5 border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bolder text-dark mb-0 tracking-tight">Cola de Atención Inmediata</h5>
                  <small className="text-muted">Pacientes con horas programadas o pendientes</small>
                </div>
                <button onClick={() => cambiarTab("users")} className="btn btn-sm btn-dark rounded-pill px-3 fw-bold">
                  Gestionar Agenda →
                </button>
              </div>

              {citas.filter((c) => c.estado !== "Cancelada" && c.estado !== "Completada").length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border">
                  <div className="fs-2 mb-2">✨</div>
                  <p className="text-muted small mb-0">No tienes consultas pendientes por atender.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {citas.filter((c) => c.estado !== "Cancelada" && c.estado !== "Completada").slice(0, 4).map((c) => (
                      <div key={c.id} className="p-3 rounded-4 bg-white border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-bolder text-dark">{c.pacienteNombre}</span>
                            <span className="badge bg-success-subtle text-success rounded-pill">{c.servicioNombre}</span>
                          </div>
                          <small className="text-muted">🕒 {c.fecha} a las {c.hora} hrs • {c.pacienteEmail}</small>
                        </div>
                        <div className="d-flex gap-2">
                          {(c.estado === "Pendiente" || c.estado === "Programada") && (
                            <button onClick={() => cambiarEstadoCita(c.id, "Confirmada")} className="btn btn-sm btn-success rounded-pill px-3 fw-bold">
                              Confirmar
                            </button>
                          )}
                          <button onClick={() => cambiarEstadoCita(c.id, "Completada")} className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-semibold">
                            Finalizar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="glass-panel p-4 rounded-5 border-0 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bolder text-dark mb-0 tracking-tight">Laboratorio Clínico</h5>
                    <small className="text-muted">Últimos archivos subidos</small>
                  </div>
                  <button onClick={() => cambiarTab("clinical")} className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold">
                    Abrir Fichas
                  </button>
                </div>

                {examenes.length === 0 ? (
                  <p className="text-muted small">No hay documentos médicos en bandeja.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {examenes.slice(0, 4).map((ex) => (
                      <div key={ex.id} className="p-3 rounded-4 bg-white border d-flex justify-content-between align-items-center gap-2">
                        <div className="text-truncate">
                          <div className="fw-bold text-dark small text-truncate">📄 {ex.nombre}</div>
                          <small className="text-muted">Subido: {ex.fechaSubida}</small>
                        </div>
                        <button onClick={() => handleToggleEstadoExamen(ex.id)} className={`btn btn-sm rounded-pill px-3 fw-bold flex-shrink-0 ${ex.estado === "Revisado" ? "btn-success" : "btn-warning text-dark"}`}>
                          {ex.estado === "Revisado" ? "✓ Revisado" : "Marcar Visto"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-4 mt-4 d-flex align-items-center justify-content-between bg-success text-white">
                <div>
                  <small className="fw-bold opacity-75">Pauta Activa Global</small>
                  <div className="fw-bolder">{planActivo?.caloriasDiarias || 1800} kcal • {planActivo?.objetivo || "Mantenimiento"}</div>
                </div>
                <button onClick={() => cambiarTab("clinical")} className="btn btn-sm btn-light text-success rounded-pill px-3 fw-bold">
                  Editar Pauta
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCitas = () => (
    <div className="glass-panel p-4 p-md-5 rounded-5 border-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">Control de Agenda y Consultas</h4>
          <p className="text-muted small mb-0">Sincronizado en tiempo real con el agendamiento de los pacientes.</p>
        </div>
        <button type="button" onClick={() => setIsCreatingCita(!isCreatingCita)} className="btn-kinetic-health py-2 px-4 border-0 shadow-sm">
          {isCreatingCita ? "Cerrar Formulario" : "+ Agendar Paciente"}
        </button>
      </div>

      {isCreatingCita && (
        <form onSubmit={handleCrearCitaManual} className="p-4 rounded-4 bg-white border shadow-sm mb-4">
          <h6 className="fw-bolder text-dark mb-3">Asignar Nueva Hora de Consulta</h6>
          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label small fw-bold text-muted text-uppercase">Paciente Registrado</label>
              <select 
                className="form-select apple-input" 
                value={nuevaCitaForm.pacienteEmail} 
                onChange={(e) => {
                  const pac = pacientes.find(p => p.email === e.target.value);
                  setNuevaCitaForm({ 
                    ...nuevaCitaForm, 
                    pacienteEmail: pac?.email || "",
                    pacienteNombre: pac?.nombre || ""
                  });
                }} 
                required
              >
                <option value="">Seleccione un paciente de la base de datos...</option>
                {pacientes.map(p => (
                  <option key={p.email} value={p.email}>{p.nombre} ({p.email})</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Prestación / Plan</label>
              <select className="form-select apple-input fw-semibold" value={nuevaCitaForm.servicioNombre} onChange={(e) => setNuevaCitaForm({ ...nuevaCitaForm, servicioNombre: e.target.value })}>
                <option value="Consulta Presencial">Consulta Presencial</option>
                <option value="Control Telemedicina">Control Telemedicina</option>
                {servicios.map((s) => (<option key={s.id} value={s.nombre}>{s.nombre}</option>))}
              </select>
            </div>
          </div>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Fecha</label>
              <input type="date" className="form-control apple-input" value={nuevaCitaForm.fecha} onChange={(e) => setNuevaCitaForm({ ...nuevaCitaForm, fecha: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Hora</label>
              <input type="time" className="form-control apple-input" value={nuevaCitaForm.hora} onChange={(e) => setNuevaCitaForm({ ...nuevaCitaForm, hora: e.target.value })} required />
            </div>
            <div className="col-md-4 text-end">
              <button type="submit" className="btn btn-success rounded-pill w-100 py-2 fw-bold">Guardar en Agenda</button>
            </div>
          </div>
        </form>
      )}

      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-6">
          <input type="search" className="form-control apple-input" placeholder="🔍 Buscar por paciente, correo o servicio..." value={busquedaCitas} onChange={(e) => setBusquedaCitas(e.target.value)} />
        </div>
        <div className="col-md-6 d-flex flex-wrap gap-2 justify-content-md-end">
          {["TODOS", "ACTIVAS", "Confirmada", "Completada", "Cancelada"].map((est) => (
            <button key={est} type="button" onClick={() => setFiltroEstadoCita(est)} className={`btn btn-sm rounded-pill px-3 fw-bold ${filtroEstadoCita === est ? "btn-dark" : "btn-light text-secondary border"}`}>
              {est}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive rounded-4 bg-white border shadow-sm overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="py-3 ps-4 small text-uppercase text-muted">Paciente</th>
              <th className="py-3 small text-uppercase text-muted">Prestación / Modalidad</th>
              <th className="py-3 small text-uppercase text-muted">Fecha y Hora</th>
              <th className="py-3 small text-uppercase text-muted">Estado</th>
              <th className="py-3 pe-4 text-end small text-uppercase text-muted">Resolución Clínica</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">No se encontraron registros para el filtro seleccionado.</td>
              </tr>
            ) : (
              citasFiltradas.map((c) => (
                <tr key={c.id}>
                  <td className="ps-4 py-3">
                    <div className="fw-bolder text-dark">{c.pacienteNombre}</div>
                    <small className="text-muted">{c.pacienteEmail}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-1">{c.servicioNombre}</span>
                  </td>
                  <td>
                    <div className="fw-bold text-dark small">{c.fecha}</div>
                    <small className="text-muted">{c.hora} hrs</small>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-1 ${c.estado === "Confirmada" ? "bg-success-subtle text-success" : c.estado === "Pendiente" || c.estado === "Programada" ? "bg-warning-subtle text-dark" : c.estado === "Completada" ? "bg-primary-subtle text-primary" : "bg-danger-subtle text-danger"}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <div className="d-inline-flex gap-2">
                      {(c.estado === "Pendiente" || c.estado === "Programada") && (
                        <button type="button" className="btn btn-sm btn-success rounded-pill px-3 fw-bold" onClick={() => cambiarEstadoCita(c.id, "Confirmada")}>Confirmar</button>
                      )}
                      {c.estado === "Confirmada" && (
                        <button type="button" className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" onClick={() => cambiarEstadoCita(c.id, "Completada")}>Marcar Atendida</button>
                      )}
                      {c.estado !== "Cancelada" && c.estado !== "Completada" && (
                        <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold" onClick={() => cambiarEstadoCita(c.id, "Cancelada")}>Anular</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClinical = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="glass-panel p-4 p-md-5 rounded-5 border-0 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold mb-1">Sincronizado con Portal del Paciente</span>
                <h4 className="fw-bolder text-dark mb-0 tracking-tight">Prescripción Dietoterapéutica</h4>
              </div>
              <button type="button" onClick={() => setIsEditingPlan(!isEditingPlan)} className="btn btn-dark rounded-pill px-3 py-2 fw-bold small shadow-sm">
                {isEditingPlan ? "Cerrar Editor" : "✏️ Ajustar Macros y Kcal"}
              </button>
            </div>

            {planActivo && (
              <>
                {isEditingPlan ? (
                  <form onSubmit={handleGuardarPlanNutricional} className="p-4 rounded-4 bg-white border shadow-sm mb-4">
                    <h6 className="fw-bolder text-dark mb-3">Parámetros Energéticos y Objetivo</h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Objetivo Clínico</label>
                        <input type="text" className="form-control apple-input" value={planActivo.objetivo} onChange={(e) => setPlanActivo({ ...planActivo, objetivo: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Requerimiento (kcal/día)</label>
                        <input type="number" className="form-control apple-input" value={planActivo.caloriasDiarias} onChange={(e) => setPlanActivo({ ...planActivo, caloriasDiarias: Number(e.target.value) })} required />
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      {planActivo.macros?.map((m, idx) => (
                        <div key={idx} className="col-md-4">
                          <label className="form-label small fw-bold text-muted">{m.nombre} (g)</label>
                          <input type="number" className="form-control apple-input" value={m.gramos} onChange={(e) => {
                            const nuevosMacros = [...planActivo.macros];
                            nuevosMacros[idx] = { ...m, gramos: Number(e.target.value) };
                            setPlanActivo({ ...planActivo, macros: nuevosMacros });
                          }} />
                        </div>
                      ))}
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-success rounded-pill px-4 py-2 fw-bold small shadow-sm">Publicar Cambios</button>
                    </div>
                  </form>
                ) : (
                  <div className="row g-3 mb-4">
                    <div className="col-sm-4">
                      <div className="p-3 rounded-4 bg-dark text-white text-center shadow-sm">
                        <small className="text-white-50 text-uppercase fw-bold d-block">Meta Diaria</small>
                        <h4 className="fw-bolder mb-0 text-success">{planActivo.caloriasDiarias} kcal</h4>
                      </div>
                    </div>
                    <div className="col-sm-8">
                      <div className="p-3 rounded-4 bg-white border h-100 d-flex align-items-center justify-content-around shadow-sm">
                        {planActivo.macros?.map((m, idx) => (
                          <div key={idx} className="text-center">
                            <small className="text-muted fw-bold d-block">{m.nombre}</small>
                            <span className="fw-bolder text-dark">{m.gramos}g</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-4 bg-white border mb-4 shadow-sm">
                  <div className="small fw-bold text-dark text-uppercase mb-2">+ Añadir Tiempo de Comida a la Pauta</div>
                  <div className="row g-2">
                    <div className="col-sm-3">
                      <input type="time" className="form-control form-control-sm apple-input" value={nuevaComida.horario} onChange={(e) => setNuevaComida({ ...nuevaComida, horario: e.target.value })} />
                    </div>
                    <div className="col-sm-3">
                      <select className="form-select form-select-sm apple-input fw-semibold" value={nuevaComida.tipo} onChange={(e) => setNuevaComida({ ...nuevaComida, tipo: e.target.value })}>
                        <option value="Desayuno">Desayuno</option>
                        <option value="Colación">Colación</option>
                        <option value="Almuerzo">Almuerzo</option>
                        <option value="Once / Pre-entreno">Once / Pre-entreno</option>
                        <option value="Cena">Cena</option>
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <input type="text" className="form-control form-control-sm apple-input" placeholder="Indicación alimentaria..." value={nuevaComida.descripcion} onChange={(e) => setNuevaComida({ ...nuevaComida, descripcion: e.target.value })} />
                    </div>
                    <div className="col-sm-2 d-grid">
                      <button type="button" onClick={handleAgregarComidaPlan} className="btn btn-sm btn-success rounded-3 fw-bold">Añadir</button>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2">
                  {planActivo.comidas?.map((c) => (
                    <div key={c.id} className="p-3 rounded-4 bg-white border shadow-sm d-flex justify-content-between align-items-center gap-3">
                      <div>
                        <span className="badge bg-success-subtle text-success me-2">{c.horario}</span>
                        <strong className="text-dark">{c.tipo}:</strong> <span className="text-muted small">{c.descripcion}</span>
                      </div>
                      <button type="button" onClick={() => handleEliminarComidaPlan(c.id)} className="btn btn-sm btn-light text-danger rounded-pill px-2" title="Quitar">✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column gap-4 h-100">
            <div className="glass-panel p-4 rounded-5 border-0">
              <h5 className="fw-bolder text-dark mb-1 tracking-tight">Auditoría de Exámenes</h5>
              <p className="text-muted small mb-3">Valida los documentos subidos por el paciente.</p>
              <div className="d-flex flex-column gap-2">
                {examenes.map((ex) => (
                  <div key={ex.id} className="p-3 rounded-4 bg-white border shadow-sm d-flex justify-content-between align-items-center gap-2">
                    <div className="text-truncate">
                      <div className="fw-bold text-dark small text-truncate">🩺 {ex.nombre}</div>
                      <small className="text-muted">Fecha: {ex.fechaSubida}</small>
                    </div>
                    <button type="button" onClick={() => handleToggleEstadoExamen(ex.id)} className={`btn btn-sm rounded-pill px-3 fw-bold flex-shrink-0 ${ex.estado === "Revisado" ? "btn-outline-success" : "btn-success"}`}>
                      {ex.estado === "Revisado" ? "✓ Revisado" : "Aprobar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-5 border-0">
              <h5 className="fw-bolder text-dark mb-1 tracking-tight">Cargar Control InBody</h5>
              <p className="text-muted small mb-3">Añade un punto biométrico a la tabla evolutiva del paciente.</p>
              <form onSubmit={handleRegistrarAntropometria}>
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <input type="number" step="0.1" className="form-control apple-input form-control-sm" placeholder="Peso (kg)" value={nuevoControlClinico.peso} onChange={(e) => setNuevoControlClinico({ ...nuevoControlClinico, peso: e.target.value })} required />
                  </div>
                  <div className="col-4">
                    <input type="number" step="0.1" className="form-control apple-input form-control-sm" placeholder="% Grasa" value={nuevoControlClinico.grasa} onChange={(e) => setNuevoControlClinico({ ...nuevoControlClinico, grasa: e.target.value })} required />
                  </div>
                  <div className="col-4">
                    <input type="number" step="0.1" className="form-control apple-input form-control-sm" placeholder="Músculo (kg)" value={nuevoControlClinico.musculo} onChange={(e) => setNuevoControlClinico({ ...nuevoControlClinico, musculo: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-dark rounded-pill w-100 py-2 fw-bold small shadow-sm">Registrar Medición en Ficha</button>
              </form>

              {pacientes.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <small className="text-uppercase fw-bold text-muted d-block mb-2">Pacientes Activos en Plataforma ({pacientes.length})</small>
                  <div className="d-flex flex-wrap gap-2">
                    {pacientes.map((p) => (
                      <span key={p.email} className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm">
                        👤 {p.nombre} ({p.pesoActual || "--"} kg)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderProducts = () => {
    return (
      <NutricionistaProductsTab
        servicios={servicios}
        categorias={categorias}
        onSave={handleGuardarServicio}
        onToggleState={handleToggleEstado}
      />
    );
  };

  const renderCategories = () => {
    return (
      <NutricionistaCategoriesTab
        categorias={categorias}
        onSave={handleGuardarCategoria}
        onDelete={eliminarCategoria}
      />
    );
  };

  // Wrapper Estructural (El Andamio Anti-Terremotos)
  const renderActiveContent = () => {
    return (
      <div
        ref={activeContentRef}
        style={{
          minHeight: contentMinHeight
            ? `max(75vh, ${contentMinHeight}px)`
            : "75vh",
          overflowAnchor: "none",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "users" && renderCitas()}
        {activeTab === "clinical" && renderClinical()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "categories" && renderCategories()}
      </div>
    );
  };

  return (
    <main className="app-wrapper py-4 py-lg-5 position-relative">
      <div className="ambient-glow-health"></div>

      {notificacion && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x p-3"
          style={{
            zIndex: 1100,
            marginTop: "75px",
            animation: "fadeSlideUp 0.3s var(--ease-spring)",
          }}
        >
          <div className="glass-panel-small px-4 py-3 rounded-pill shadow-glass d-flex align-items-center gap-3 border">
            <span>
              {notificacion.tipo === "success"
                ? "✅"
                : notificacion.tipo === "danger"
                  ? "⛔"
                  : "ℹ️"}
            </span>
            <span className="fw-bold text-dark small">
              {notificacion.texto}
            </span>
            <button
              type="button"
              className="btn-close"
              style={{ fontSize: "0.75rem" }}
              onClick={() => setNotificacion(null)}
            />
          </div>
        </div>
      )}

      <div
        className="container-fluid px-3 px-md-5 position-relative"
        style={{ zIndex: 2 }}
      >
        <div className="row g-4">
          <NutricionistaSidebar
            activeTab={activeTab}
            onTabChange={cambiarTab}
            nombreNutricionista={nutricionistaActual?.nombre || "Especialista"}
            emailNutricionista={nutricionistaActual?.email}
            fotoPerfil={nutricionistaActual?.fotoPerfil}
            pendientesCount={{
              citas: citasPendientesCount,
              examenes: examenesPendientesCount,
            }}
          />

          <section className="col-12 col-lg-9">
            <div
              className="p-4 p-md-5 rounded-5 shadow-glass mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
              style={{
                background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                color: "white",
              }}
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-white text-success rounded-pill px-3 py-1 fw-bold">
                    ESTACIÓN CLÍNICA
                  </span>
                  <span className="text-white-50 small">
                    •{" "}
                    {new Date().toLocaleDateString("es-CL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <h2 className="fw-bolder mb-1 tracking-tight">
                  Bienvenido/a,{" "}
                  <span className="text-white">
                    {nutricionistaActual?.nombre || "Especialista"}
                  </span>
                </h2>
                <p className="mb-0 text-white-50 small">
                  {activeTab === "dashboard" &&
                    "Panorama operativo de tu consulta, pacientes en espera y bandeja de laboratorio."}
                  {activeTab === "users" &&
                    "Gestión de reservas de horas, confirmación de asistencia y programación manual."}
                  {activeTab === "clinical" &&
                    "Prescripción de pautas alimentarias, auditoría de exámenes y registro InBody."}
                  {activeTab === "products" &&
                    "Administración de planes nutricionales y aranceles publicados en el catálogo."}
                  {activeTab === "categories" &&
                    "Organización de especialidades clínicas del centro."}
                </p>
              </div>
              <div className="d-none d-xl-flex align-items-center gap-3 bg-white bg-opacity-25 p-3 rounded-4 backdrop-blur">
                <div className="fs-2">🩺</div>
                <div>
                  <div className="fw-bolder text-white leading-tight">
                    {pacientes.length} Pacientes
                  </div>
                  <small className="text-white-50">
                    Registrados en plataforma
                  </small>
                </div>
              </div>
            </div>

            {/* Inyección del contenido estabilizado */}
            {renderActiveContent()}
          </section>
        </div>
      </div>
    </main>
  );
}