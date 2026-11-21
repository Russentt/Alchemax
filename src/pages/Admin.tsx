import { useEffect, useState, useRef, useCallback, type JSX } from "react";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import AdminStatCard from "../components/admin/AdminStatCard";
import type {
  Categoria,
  Cita,
  Compra,
  EstadoCita,
  EstadoCompra,
  PeriodoReporte,
  ReporteAdmin,
  Servicio,
  Usuario,
} from "../types/index";
import { StorageUsuario } from "../services/storageUsuario";
import { useNavigate } from "react-router";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";
import { TiendaService } from "../services/tiendaService";
import { CitasService } from "../services/citasService";
import ModalProducto from "../components/admin/ModalProducto";
import ModalCategoria from "../components/admin/ModalCategoria";
import ModalUsuario from "../components/admin/ModalUsuario";
import ModalCrearUsuario from "../components/admin/ModalCrearUsuario";
import { formatPriceCLP } from "../utils/formatPriceCLP";

export default function Admin(): JSX.Element {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const sesion = StorageUsuario.getUsuarioSesion();
    if (!sesion || sesion.rol !== 'admin') {
      navigate("/login");
    }
  }, [navigate]);

  // Estados Globales
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [emailOriginal, setEmailOriginal] = useState<string>("");
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: "info" | "success" | "danger"; } | null>(null);

  // Estados Categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);
  const [modalCrearCategoria, setModalCrearCategoria] = useState(false);

  // Estados Servicios
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const cargarServicios = async () => {
    const data = await StorageServicios.getServicios();
    setServicios(data);
  };

  const [busquedaServicios, setBusquedaServicios] = useState("");
  const [paginaServicios, setPaginaServicios] = useState(1);
  const serviciosPorPagina = 5;
  const terminoBusquedaServicios = busquedaServicios.trim().toLocaleLowerCase("es-CL");
  const serviciosFiltrados = servicios.filter((servicio) =>
    `${servicio.id ?? ""} ${servicio.nombre ?? ""} ${servicio.categoriaNombre ?? ""}`
      .toLocaleLowerCase("es-CL")
      .includes(terminoBusquedaServicios),
  );
  const totalPaginasServicios = Math.max(
    1,
    Math.ceil(serviciosFiltrados.length / serviciosPorPagina),
  );
  const paginaServiciosActual = Math.min(paginaServicios, totalPaginasServicios);
  const serviciosPagina = serviciosFiltrados.slice(
    (paginaServiciosActual - 1) * serviciosPorPagina,
    paginaServiciosActual * serviciosPorPagina,
  );
  const primerServicio =
    serviciosFiltrados.length === 0
      ? 0
      : (paginaServiciosActual - 1) * serviciosPorPagina + 1;
  const ultimoServicio = Math.min(
    paginaServiciosActual * serviciosPorPagina,
    serviciosFiltrados.length,
  );
  const [modalProducto, setModalProducto] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);

  // Estados Usuarios
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [modalCrearUsuario, setModalCrearUsuario] = useState(false);

  // Estados Reportes Administrativos y Operaciones (Compras + Citas)
  const [periodoReporte, setPeriodoReporte] = useState<PeriodoReporte>("mes");
  const [todasLasCompras, setTodasLasCompras] = useState<Compra[]>([]);
  const [todasLasCitas, setTodasLasCitas] = useState<Cita[]>([]);
  const [reporteBackend, setReporteBackend] = useState<ReporteAdmin | null>(null);
  const [cargandoOperaciones, setCargandoOperaciones] = useState<boolean>(false);
  const [filtroTipoOperacion, setFiltroTipoOperacion] = useState<"todas" | "compras" | "citas">("todas");
  const [busquedaOperaciones, setBusquedaOperaciones] = useState<string>("");

  const cargarOperacionesYReporte = useCallback(
    async (periodoObjetivo: PeriodoReporte = periodoReporte) => {
      setCargandoOperaciones(true);
      try {
        const [comprasData, citasData, repData] = await Promise.all([
          TiendaService.getTodasLasCompras(),
          CitasService.getCitas(),
          TiendaService.getReporteAdmin(periodoObjetivo),
        ]);
        setTodasLasCompras(comprasData);
        setTodasLasCitas(citasData);
        setReporteBackend(repData);
      } finally {
        setCargandoOperaciones(false);
      }
    },
    [periodoReporte],
  );

  useEffect(() => {
    let active = true;
    const sincronizarOperaciones = async () => {
      const [comprasData, citasData, repData] = await Promise.all([
        TiendaService.getTodasLasCompras(),
        CitasService.getCitas(),
        TiendaService.getReporteAdmin(periodoReporte),
      ]);
      if (!active) return;
      setTodasLasCompras(comprasData);
      setTodasLasCitas(citasData);
      setReporteBackend(repData);
    };
    void sincronizarOperaciones();
    return () => {
      active = false;
    };
  }, [periodoReporte]);

  const reporteEfectivo: ReporteAdmin =
    reporteBackend ??
    TiendaService.calcularReporteLocal(todasLasCompras, todasLasCitas, periodoReporte);

  const handleCambiarEstadoCompra = async (id: number, nuevoEstado: EstadoCompra) => {
    const res = await TiendaService.cambiarEstadoCompra(id, nuevoEstado);
    if (!res.success) {
      mostrarNotificacion(res.mensaje, "danger");
      return;
    }
    await cargarOperacionesYReporte(periodoReporte);
    mostrarNotificacion(res.mensaje, "success");
  };

  const handleCambiarEstadoCitaAdmin = async (id: number, nuevoEstado: EstadoCita) => {
    const res = await CitasService.cambiarEstado(id, nuevoEstado);
    if (!res.success) {
      mostrarNotificacion(res.mensaje, "danger");
      return;
    }
    await cargarOperacionesYReporte(periodoReporte);
    mostrarNotificacion(res.mensaje, "success");
  };

  // Estados Terminal CLI
  const [terminalHistory, setTerminalHistory] = useState<{ id: string; type: 'cmd' | 'output'; content: string | JSX.Element }[]>([
    { id: 'init1', type: 'output', content: 'Alchemax OS v11.0.4 (NutriVida Core Branch)' },
    { id: 'init2', type: 'output', content: 'Escribe "help" para ver la lista de comandos o "man [comando]" para el manual.' }
  ]);
  const [currentCmd, setCurrentCmd] = useState("");
  
  // Referencias para la UX de la Terminal
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalSeqRef = useRef<number>(1);

  // Estado para el System Event Log Dinámico
  const [systemLogs, setSystemLogs] = useState<{ id: number, text: string, color: string }[]>([
    { id: 1, text: "[OK] Conexión a la base de datos establecida (Latencia: 12ms).", color: "#10b981" },
    { id: 2, text: "[OK] Uso de memoria del servidor en parámetros óptimos (45%).", color: "#10b981" },
    { id: 3, text: "[INFO] Sincronización con el Portal del Paciente activa.", color: "#6b7280" }
  ]);

  const mostrarNotificacion = (texto: string, tipo: "info" | "success" | "danger" = "info") => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  // Motor del Event Log Dinámico
  useEffect(() => {
    if (activeTab !== "dashboard") return;
    const interval = setInterval(() => {
      const possibleEvents = [
        { text: "[INFO] Nuevo inicio de sesión detectado en sistema.", color: "#3b82f6" },
        { text: "[OK] Respaldo automático de la base de datos completado.", color: "#10b981" },
        { text: "[WARN] Petición bloqueada por reglas de firewall.", color: "#f59e0b" },
        { text: "[INFO] Actualización de catálogo clínico propagada con éxito.", color: "#3b82f6" },
        { text: "[OK] Ping a servidor central exitoso (18ms).", color: "#10b981" },
        { text: "[INFO] Ejecución de tarea programada (Cron) finalizada.", color: "#6b7280" }
      ];
      const newEvent = { id: Date.now(), ...possibleEvents[Math.floor(Math.random() * possibleEvents.length)] };
      setSystemLogs(prev => {
        const updated = [...prev, newEvent];
        return updated.length > 5 ? updated.slice(1) : updated;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Helpers de Carga
  const cargarCategorias = async () => {
    const data = await StorageCategorias.getCategorias();
    setCategorias(data);
  };

  const cargarUsuarios = async () => {
    const data = await StorageUsuario.getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    let active = true;
    const inicializarDatosBase = async () => {
      const [cats, svcs, usrs] = await Promise.all([
        StorageCategorias.getCategorias(),
        StorageServicios.getServicios(),
        StorageUsuario.getUsuarios(),
      ]);
      if (!active) return;
      setCategorias(cats);
      setServicios(svcs);
      setUsuarios(usrs);
    };
    void inicializarDatosBase();
    return () => {
      active = false;
    };
  }, []);

  // Handlers Categorías
  const handleGuardarCategoria = async (datos: Omit<Categoria, "id" | "serviciosAsociados">) => {
    if (categoriaEditar) {
      const res = await StorageCategorias.updateCategoria({ ...categoriaEditar, ...datos });
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Área de especialidad actualizada", "success");
    } else {
      const res = await StorageCategorias.crearCategoria(datos);
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Área de especialidad creada", "success");
    }
    cargarCategorias();
    setModalCrearCategoria(false);
    setCategoriaEditar(null);
  };

  const EliminarCategoria = async () => {
    if (!categoriaEliminar) return;

    const vinculados = servicios.filter(
      (s) => Number(s.categoriaId) === Number(categoriaEliminar.id)
    ).length;

    if (vinculados > 0) {
      mostrarNotificacion(
        `No puedes eliminar "${categoriaEliminar.nombre}" porque tiene ${vinculados} servicio(s) asociado(s).`,
        "danger"
      );
      setCategoriaEliminar(null);
      return;
    }

    try {
      await StorageCategorias.deleteCategoria(categoriaEliminar.id);
      await cargarCategorias();
      mostrarNotificacion(`Área "${categoriaEliminar.nombre}" eliminada`, "success");
    } catch {
      mostrarNotificacion("Error al eliminar la categoría.", "danger");
    }
    setCategoriaEliminar(null);
  };

  // Handlers Servicios
  const abrirCrearServicio = () => { setServicioAEditar(null); setModalProducto(true); };
  const abrirEditarServicio = (item: Servicio) => { setServicioAEditar(item); setModalProducto(true); };

  const handleGuardarServicio = async (datos: Omit<Servicio, "id" | "estado">) => {
    const categoriaEncontrada = categorias.find(
(c) => Number(c.id) === Number(datos.categoriaId),);
    const nombreCategoria = categoriaEncontrada ? categoriaEncontrada.nombre : "General";

    if (servicioAEditar) {
      const res = await StorageServicios.updateServicio({ ...servicioAEditar, ...datos, categoriaNombre: nombreCategoria });
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Servicio clínico actualizado", "success");
    } else {
      const res = await StorageServicios.crearServicio({ ...datos, categoriaNombre: nombreCategoria, estado: "Activo" });
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Servicio clínico creado", "success");
    }
    cargarServicios();
    cargarCategorias();
    setModalProducto(false);
    setServicioAEditar(null);
  };

  const handleToggleEstado = async (id: number) => {
    await StorageServicios.toggleEstado(id);
    await cargarServicios();
    mostrarNotificacion("Visibilidad de servicio actualizada.", "info");
  };

  // Handlers Usuarios
  const handleCrearUsuario = async (nuevoUsuario: Usuario) => {
    const res = await StorageUsuario.crearUsuarioAdmin(nuevoUsuario);

    if (!res.success) {
      return mostrarNotificacion(res.mensaje, "danger");
    }

    await cargarUsuarios();
    setModalCrearUsuario(false);
    mostrarNotificacion("Usuario registrado exitosamente.", "success");
  };

  const confirmarEliminacion = async () => {
    if (!usuarioAEliminar || !usuarioAEliminar.id) return;
    const res = await StorageUsuario.deleteUsuario(Number(usuarioAEliminar.id));
    if (res.success) {
      await cargarUsuarios();
      mostrarNotificacion("Identidad revocada del sistema.", "success");
    } else {
      mostrarNotificacion(res.mensaje, "danger");
    }

    setUsuarioAEliminar(null);
  };

  const guardarEdicion = async (usuarioActualizado: Usuario) => {
    const emailNormalizado = usuarioActualizado.email.trim().toLowerCase();
    const duplicado = usuarios.some(
      (u) =>
        u.email.toLowerCase() === emailNormalizado &&
        u.email.toLowerCase() !== emailOriginal.toLowerCase(),
    );

    if (duplicado) {
      mostrarNotificacion("Ya existe otro usuario registrado con ese correo.", "danger");
      return;
    }

    const res = await StorageUsuario.updateUsuario(usuarioActualizado, emailOriginal);
    if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
    await cargarUsuarios();
    mostrarNotificacion("Identidad actualizada.", "success");
    setUsuarioAEditar(null);
  };

  const usuariosFiltrados = usuarios.filter((u) => 
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Funciones del Terminal CLI ---
  useEffect(() => {
    // Aisla el scroll al contenedor interno sin mover la ventana
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Al hacer clic en el área negra, hace foco automáticamente en el input
  const handleTerminalFocus = () => {
    terminalInputRef.current?.focus();
  };

  // Generador de Linux-style Manual Pages
  const generateManPage = (cmdName: string): string => {
    switch (cmdName) {
      case 'useradd':
        return `USERADD(8)               Comandos de Administración              USERADD(8)\n\nNAME\n       useradd - crea una nueva cuenta de usuario en NutriVida\n\nSYNOPSIS\n       useradd [EMAIL] [NOMBRE] [ROL]\n\nDESCRIPTION\n       Crea una nueva identidad en la base de datos local. El sistema\n       valida que el correo no esté duplicado. La contraseña se\n       asignará de forma estática por defecto.\n\nOPTIONS\n       EMAIL   Dirección de correo electrónico único (UID).\n       NOMBRE  Nombre completo del usuario (usar comillas si hay espacios).\n       ROL     Nivel de acceso (admin, nutricionista, usuario).\n\nAUTHOR\n       Escrito por Alchemax Core Team.`;
      case 'ls':
        return `LS(1)                        Comandos de Usuario                       LS(1)\n\nNAME\n       ls - lista el contenido de los directorios del sistema\n\nSYNOPSIS\n       ls [DIRECTORIO]\n\nDESCRIPTION\n       Lista información sobre los registros en el módulo especificado.\n       Si no se proporciona un directorio, muestra los módulos raíz.\n\nDIRECTORIES\n       usuarios     Lista de identidades registradas.\n       servicios    Lista del catálogo clínico de planes.\n       categorias   Lista de taxonomía de áreas clínicas.\n\nAUTHOR\n       Escrito por Alchemax Core Team.`;
      case 'catadd':
        return `CATADD(8)                Comandos de Administración               CATADD(8)\n\nNAME\n       catadd - crea una nueva categoría en la taxonomía clínica\n\nSYNOPSIS\n       catadd [NOMBRE_CATEGORIA]\n\nDESCRIPTION\n       Registra una nueva especialidad en la plataforma. Usar comillas\n       si el nombre contiene espacios (ej. catadd "Salud Mental").`;
      default:
        return `No manual entry for ${cmdName}`;
    }
  };

  const handleTerminalCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = currentCmd.trim();
      terminalSeqRef.current += 1;
      const cmdSeq = terminalSeqRef.current;
      const newHistory = [...terminalHistory, { id: `in-${cmdSeq}`, type: 'cmd' as const, content: cmd }];
      let output: string | JSX.Element = "";
      
      const argsMatch = cmd.match(/(?:[^\s"]+|"[^"]*")+/g);
      const args = argsMatch ? argsMatch.map(arg => arg.replace(/^"|"$/g, '')) : [];

      switch (args[0]?.toLowerCase()) {
        case "":
          break;
        case "help":
          output = (
            <div>
              <strong>Manual de Comandos Alchemax CLI</strong><br/>
              <span className="text-info">ls [directorio]</span> - Lista recursos (opciones: usuarios, servicios, categorias)<br/>
              <span className="text-info">useradd [email] [nombre] [rol]</span> - Crea una cuenta de usuario<br/>
              <span className="text-info">userdel [email]</span> - Elimina una cuenta de usuario<br/>
              <span className="text-info">catadd [nombre]</span> - Crea una categoría clínica<br/>
              <span className="text-info">catdel [id]</span> - Elimina una categoría por su ID<br/>
              <span className="text-info">svctoggle [id]</span> - Activa/desactiva un servicio clínico<br/>
              <span className="text-info">man [comando]</span> - Muestra la página de manual de un comando<br/>
              <span className="text-info">whoami</span> - Muestra los privilegios actuales<br/>
              <span className="text-info">clear</span> - Limpia la salida de la terminal<br/>
              <span className="text-info">reboot</span> - Reinicia la consola de administración
            </div>
          );
          break;
        case "man":
          if (args[1]) {
            output = generateManPage(args[1].toLowerCase());
          } else {
            output = "¿Qué página de manual deseas?\nUso: man [comando]";
          }
          break;
        case "clear":
          setTerminalHistory([]);
          setCurrentCmd("");
          return;
        case "whoami":
          output = "root (uid=0, gid=0) - Administrador Maestro";
          break;
        case "reboot":
          output = "Iniciando secuencia de reinicio...\nFinalizando procesos... OK\nDesmontando volúmenes... OK";
          setTimeout(() => window.location.reload(), 1500);
          break;
        case "ls":
          if (args[1] === "usuarios") {
            output = usuarios.map(u => `[${u.rol.toUpperCase()}] ${u.email}\t- ${u.nombre}`).join("\n");
          } else if (args[1] === "servicios") {
            output = servicios.map(s => `[${s.estado.toUpperCase()}]\t${s.id}\t- ${s.nombre} ($${s.precio})`).join("\n");
          } else if (args[1] === "categorias") {
            output = categorias.map(c => `[ID: ${c.id}]\t${c.nombre}\t(Servicios: ${c.serviciosAsociados || 0})`).join("\n");
          } else if (args[1] === "compras") {
            output = todasLasCompras.length === 0
              ? "Sin compras registradas."
              : todasLasCompras.map(c => `[${c.estado.toUpperCase()}]\t#CMP-${c.id}\t${c.fechaCompra}\t${c.nombre} (${formatPriceCLP(c.monto)})`).join("\n");
          } else if (args[1] === "citas") {
            output = todasLasCitas.length === 0
              ? "Sin citas registradas."
              : todasLasCitas.map(c => `[${c.estado.toUpperCase()}]\t#CIT-${c.id}\t${c.fecha} ${c.hora}\t${c.tipo} - ${c.profesional}`).join("\n");
          } else {
            output = "usuarios/  servicios/  categorias/  compras/  citas/";
          }
          break;
        case "catadd":
          if (args[1]) {
            handleGuardarCategoria({ nombre: args[1], descripcion: "Creado vía Terminal Alchemax" } as Categoria);
            output = `Directorio de categoría '${args[1]}' creado exitosamente.`;
          } else {
            output = "catadd: faltan argumentos. Uso: catadd [nombre]";
          }
          break;
        case "catdel":
          if (args[1]) {
            const catToDelete = categorias.find((c) => Number(c.id) === Number(args[1]));
            if (catToDelete) {
              StorageCategorias.deleteCategoria(catToDelete.id);
              cargarCategorias();
              output = `Categoría ${args[1]} eliminada.`;
            } else {
              output = `catdel: no se encontró la categoría con ID ${args[1]}`;
            }
          } else {
            output = "catdel: faltan argumentos. Uso: catdel [id]";
          }
          break;
        case "useradd":
          if (args[1] && args[2] && args[3]) {
            const newU: Omit<Usuario, "id"> = {
              email: args[1],
              nombre: args[2],
              rol: args[3] as Usuario["rol"],
              password: "password123",
              genero: "otro",
              fechaNacimiento: "1990-01-01",
            };

            const res = await StorageUsuario.crearUsuarioAdmin(newU);

            if (res.success) {
              await cargarUsuarios();
              output = `Usuario ${newU.email} creado con éxito.`;
            } else {
              output = `useradd: ${res.mensaje}`;
            }
          } else {
            output = "useradd: faltan argumentos. Uso: useradd [email] [nombre] [rol]";
          }
          break;
        case "userdel":
          if (args[1]) {
            const correoAEliminar = args[1].trim().toLowerCase();
            
            const targetUser = usuarios.find(
              (u) => u.email.toLowerCase() === correoAEliminar
            );

            if (targetUser && targetUser.id) {
              const res = await StorageUsuario.deleteUsuario(Number(targetUser.id));

              if (res.success) {
                await cargarUsuarios();
                output = `Usuario ${args[1]} eliminado del sistema.`;
              } else {
                output = `userdel: ${res.mensaje}`;
              }
            } else {
              output = `userdel: no se encontró ningún usuario con el correo '${args[1]}'.`;
            }
          } else {
            output = "userdel: faltan argumentos. Uso: userdel [email]";
          }
          break;
        default:
          output = `bash: command not found: ${args[0]}`;
      }

      if (output) {
        terminalSeqRef.current += 1;
        newHistory.push({ id: `out-${terminalSeqRef.current}`, type: 'output', content: output });
      }

      setTerminalHistory(newHistory);
      setCurrentCmd("");
    }
  };

  // --- RENDERS DE VISTAS (DARK UI) ---
  const etiquetasPeriodo: Record<PeriodoReporte, string> = {
    semana: "Últimos 7 días / Semana actual",
    mes: "Últimos 30 días / Mes en curso",
    anio: `Año calendario ${new Date().getFullYear()}`,
    historico: "Acumulado histórico en base de datos",
  };

  const servicioTop = reporteEfectivo.serviciosMasSolicitados[0] ?? null;

  const renderDashboard = () => (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      {/* Barra de filtro de período para reportes administrativos */}
      <div
        className="p-3 p-md-4 rounded-4 shadow-sm mb-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3"
        style={{ background: "#1f2937", border: "1px solid #374151" }}
      >
        <div>
          <h5 className="fw-bolder mb-1 text-white">
            Resumen Ejecutivo y Reportes de Operaciones
          </h5>
          <p className="mb-0 small font-monospace" style={{ color: "#9ca3af" }}>
            Período activo: <strong className="text-info">{etiquetasPeriodo[periodoReporte]}</strong>
            {reporteEfectivo.fechaInicio && reporteEfectivo.fechaFin
              ? ` (${reporteEfectivo.fechaInicio} a ${reporteEfectivo.fechaFin})`
              : ""}
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <div
            className="btn-group"
            role="group"
            aria-label="Filtrar estadísticas por período"
          >
            {(
              [
                { id: "semana", label: "Semana" },
                { id: "mes", label: "Mes" },
                { id: "anio", label: "Año" },
                { id: "historico", label: "Histórico" },
              ] as { id: PeriodoReporte; label: string }[]
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={periodoReporte === p.id}
                onClick={() => setPeriodoReporte(p.id)}
                className={`btn btn-sm fw-bold px-3 ${
                  periodoReporte === p.id
                    ? "btn-primary text-white"
                    : "btn-outline-secondary text-light"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              void cargarOperacionesYReporte(periodoReporte);
              void cargarServicios();
              void cargarCategorias();
              void cargarUsuarios();
              mostrarNotificacion("Indicadores actualizados desde la base de datos.", "info");
            }}
            disabled={cargandoOperaciones}
            className="btn btn-sm btn-outline-info fw-bold"
          >
            {cargandoOperaciones ? "⏳ Sincronizando..." : "🔄 Actualizar"}
          </button>
        </div>
      </div>

      {/* Tarjetas de Indicadores Principales (KPIs) */}
      <div className="row g-4 mb-4">
        <AdminStatCard
          title="Total Operaciones"
          value={reporteEfectivo.totalOperaciones}
          subtitle={`${reporteEfectivo.totalCompras} compras • ${reporteEfectivo.totalCitas} citas clínicas`}
          icon="📈"
          theme="primary"
        />
        <AdminStatCard
          title="Monto Total Vendido"
          value={formatPriceCLP(reporteEfectivo.montoTotalVendido)}
          subtitle={`Ticket promedio: ${formatPriceCLP(reporteEfectivo.ticketPromedio)}`}
          icon="💰"
          theme="success"
        />
        <AdminStatCard
          title="Servicios Vendidos / Realizados"
          value={`${reporteEfectivo.comprasActivas + reporteEfectivo.comprasCompletadas} vendidos`}
          subtitle={`${reporteEfectivo.serviciosRealizados} prestaciones completadas`}
          icon="🩺"
          theme="info"
        />
        <AdminStatCard
          title="Servicio Más Solicitado"
          value={servicioTop ? servicioTop.nombre : "Sin ventas"}
          subtitle={
            servicioTop
              ? `${servicioTop.cantidadVendida} contrataciones (${formatPriceCLP(servicioTop.montoRecaudado)})`
              : "No hay compras registradas en este período"
          }
          icon="🏆"
          theme="warning"
        />
        <AdminStatCard
          title="Catálogo Clínico Activo"
          value={servicios.filter((s) => s.estado === "Activo").length}
          subtitle={`${categorias.length} categorías clínicas registradas`}
          icon="📦"
          theme="primary"
        />
        <AdminStatCard
          title="Usuarios Registrados"
          value={usuarios.length}
          subtitle="Cuentas activas en la plataforma"
          icon="👥"
          theme="info"
        />
      </div>

      {/* Ranking y Gráfico de Servicios Más Solicitados + Estado de Operaciones */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-7">
          <div
            className="p-4 rounded-4 shadow-sm h-100"
            style={{ background: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bolder mb-1">Ranking de Servicios Más Solicitados</h5>
                <p className="mb-0 small text-secondary">
                  Distribución de demanda e ingresos reales según contrataciones del período
                </p>
              </div>
              <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill px-3 py-2 font-monospace">
                {reporteEfectivo.serviciosMasSolicitados.length} servicios con ventas
              </span>
            </div>

            {reporteEfectivo.serviciosMasSolicitados.length === 0 ? (
              <div className="text-center py-5 text-secondary font-monospace">
                No se registran ventas de servicios en el período seleccionado.
              </div>
            ) : (
              <>
                {/* Gráfico de barras horizontales */}
                <div className="d-flex flex-column gap-3 mb-4">
                  {reporteEfectivo.serviciosMasSolicitados.map((srv, idx) => (
                    <div key={`${srv.nombre}-${idx}`}>
                      <div className="d-flex justify-content-between align-items-center small mb-1">
                        <span className="fw-bold text-white">
                          <span className="badge bg-secondary me-2 font-monospace">
                            #{idx + 1}
                          </span>
                          {srv.nombre}
                        </span>
                        <span className="font-monospace text-info">
                          {srv.cantidadVendida} ud. • {formatPriceCLP(srv.montoRecaudado)} ({srv.porcentajeVentas}%)
                        </span>
                      </div>
                      <div
                        className="progress"
                        style={{ height: "10px", backgroundColor: "#111827" }}
                        role="progressbar"
                        aria-label={`Participación de ventas de ${srv.nombre}`}
                        aria-valuenow={srv.porcentajeVentas}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${Math.max(8, srv.porcentajeVentas)}%`,
                            background:
                              idx === 0
                                ? "linear-gradient(90deg, #10b981, #059669)"
                                : idx === 1
                                  ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                                  : "linear-gradient(90deg, #f59e0b, #d97706)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabla resumen de servicios más solicitados */}
                <div className="table-responsive rounded-3 overflow-hidden" style={{ border: "1px solid #374151" }}>
                  <table className="table table-dark table-sm align-middle mb-0" style={{ backgroundColor: "#111827" }}>
                    <thead style={{ borderBottom: "1px solid #374151" }}>
                      <tr>
                        <th className="small text-uppercase text-secondary border-0">#</th>
                        <th className="small text-uppercase text-secondary border-0">Servicio</th>
                        <th className="small text-uppercase text-secondary border-0 text-center">Unidades</th>
                        <th className="small text-uppercase text-secondary border-0 text-end">Ingresos</th>
                        <th className="small text-uppercase text-secondary border-0 text-end">% Demanda</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteEfectivo.serviciosMasSolicitados.map((srv, idx) => (
                        <tr key={`row-${srv.nombre}-${idx}`}>
                          <td className="font-monospace text-secondary">{idx + 1}</td>
                          <td className="fw-semibold text-white">{srv.nombre}</td>
                          <td className="text-center font-monospace text-info">{srv.cantidadVendida}</td>
                          <td className="text-end font-monospace text-success">{formatPriceCLP(srv.montoRecaudado)}</td>
                          <td className="text-end font-monospace">{srv.porcentajeVentas}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desglose de Estados de Operaciones (Compras y Citas) */}
        <div className="col-12 col-xl-5">
          <div
            className="p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between"
            style={{ background: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }}
          >
            <div>
              <h5 className="fw-bolder mb-1">Desglose de Operaciones</h5>
              <p className="mb-3 small text-secondary">
                Estado actual de compras y citas clínicas en el período seleccionado
              </p>

              <div className="p-3 rounded-3 mb-3" style={{ background: "#111827", border: "1px solid #374151" }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small text-uppercase text-info">
                    🛍️ Compras de Planes ({reporteEfectivo.totalCompras})
                  </span>
                  <span className="font-monospace small text-success fw-bold">
                    {formatPriceCLP(reporteEfectivo.montoTotalVendido)}
                  </span>
                </div>
                <div className="row g-2 text-center font-monospace small">
                  <div className="col-4">
                    <div className="p-2 rounded bg-success bg-opacity-10 border border-success border-opacity-25">
                      <div className="text-success fw-bolder fs-5">{reporteEfectivo.comprasActivas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.72rem" }}>Activas</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded bg-primary bg-opacity-10 border border-primary border-opacity-25">
                      <div className="text-primary fw-bolder fs-5">{reporteEfectivo.comprasCompletadas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.72rem" }}>Completadas</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25">
                      <div className="text-danger fw-bolder fs-5">{reporteEfectivo.comprasCanceladas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.72rem" }}>Canceladas</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-3" style={{ background: "#111827", border: "1px solid #374151" }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small text-uppercase text-warning">
                    📅 Citas Clínicas ({reporteEfectivo.totalCitas})
                  </span>
                  <span className="font-monospace small text-secondary">
                    {reporteEfectivo.citasCompletadas} realizadas
                  </span>
                </div>
                <div className="row g-2 text-center font-monospace small">
                  <div className="col-3">
                    <div className="p-2 rounded bg-warning bg-opacity-10 border border-warning border-opacity-25">
                      <div className="text-warning fw-bolder">{reporteEfectivo.citasProgramadas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.68rem" }}>Prog.</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 rounded bg-info bg-opacity-10 border border-info border-opacity-25">
                      <div className="text-info fw-bolder">{reporteEfectivo.citasConfirmadas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.68rem" }}>Conf.</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 rounded bg-success bg-opacity-10 border border-success border-opacity-25">
                      <div className="text-success fw-bolder">{reporteEfectivo.citasCompletadas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.68rem" }}>Compl.</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25">
                      <div className="text-danger fw-bolder">{reporteEfectivo.citasCanceladas}</div>
                      <div className="text-secondary" style={{ fontSize: "0.68rem" }}>Canc.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("operations")}
              className="btn btn-primary fw-bold w-100 mt-3"
            >
              🧾 Gestionar Todas las Operaciones y Estados →
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-4 shadow-sm border-0" style={{ background: 'linear-gradient(145deg, #1f2937 0%, #111827 100%)' }}>
        <h5 className="fw-bolder mb-3 tracking-tight" style={{ color: '#f3f4f6' }}>Registro de Eventos del Sistema</h5>
        <div className="font-monospace small d-flex flex-column gap-1">
          {systemLogs.map((log) => (
            <p key={log.id} className="mb-0" style={{ color: log.color, animation: "fadeIn 0.5s ease-out" }}>
              {log.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOperations = () => {
    const termino = busquedaOperaciones.trim().toLocaleLowerCase("es-CL");

    const comprasFiltradas = todasLasCompras.filter((c) =>
      `${c.id} ${c.nombre} ${c.estado} ${c.fechaCompra} ${c.usuario?.nombre ?? ""} ${c.usuario?.email ?? ""}`
        .toLocaleLowerCase("es-CL")
        .includes(termino),
    );

    const citasFiltradas = todasLasCitas.filter((c) =>
      `${c.id} ${c.tipo} ${c.profesional} ${c.estado} ${c.fecha} ${c.hora} ${c.pacienteNombre ?? ""} ${c.pacienteEmail ?? ""}`
        .toLocaleLowerCase("es-CL")
        .includes(termino),
    );

    return (
      <div
        className="p-4 rounded-4 shadow-lg border-0"
        style={{
          background: "#1f2937",
          color: "#f3f4f6",
          animation: "fadeSlideUp 0.3s var(--ease-spring)",
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <h5 className="fw-bolder mb-1 tracking-tight">
              Control de Operaciones Clínicas y Compras
            </h5>
            <p className="mb-0 small text-secondary">
              Consulta todas las contrataciones y citas registradas en la base de datos y actualiza sus estados.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div className="btn-group" role="group" aria-label="Filtrar por tipo de operación">
              <button
                type="button"
                onClick={() => setFiltroTipoOperacion("todas")}
                className={`btn btn-sm fw-bold ${
                  filtroTipoOperacion === "todas" ? "btn-primary" : "btn-outline-secondary text-light"
                }`}
              >
                Todas ({todasLasCompras.length + todasLasCitas.length})
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipoOperacion("compras")}
                className={`btn btn-sm fw-bold ${
                  filtroTipoOperacion === "compras" ? "btn-primary" : "btn-outline-secondary text-light"
                }`}
              >
                Compras ({todasLasCompras.length})
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipoOperacion("citas")}
                className={`btn btn-sm fw-bold ${
                  filtroTipoOperacion === "citas" ? "btn-primary" : "btn-outline-secondary text-light"
                }`}
              >
                Citas ({todasLasCitas.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => void cargarOperacionesYReporte(periodoReporte)}
              className="btn btn-sm btn-outline-info fw-bold"
              disabled={cargandoOperaciones}
            >
              🔄 Recargar
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="buscar-operaciones-admin" className="form-label small text-secondary">
            Buscar operación por paciente, correo, servicio, profesional o ID
          </label>
          <input
            id="buscar-operaciones-admin"
            type="search"
            className="form-control bg-dark text-white border-secondary"
            placeholder="Ej. Camila, Plan Deportivo, Nut. Andrea Valdés, Completado..."
            value={busquedaOperaciones}
            onChange={(e) => setBusquedaOperaciones(e.target.value)}
          />
        </div>

        {/* Tabla de Compras / Contrataciones */}
        {(filtroTipoOperacion === "todas" || filtroTipoOperacion === "compras") && (
          <div className="mb-4">
            <h6 className="fw-bold text-info text-uppercase small mb-3 font-monospace">
              🛍️ Compras y Contrataciones de Servicios ({comprasFiltradas.length})
            </h6>
            <div className="table-responsive rounded-3 overflow-hidden" style={{ border: "1px solid #374151" }}>
              <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: "#111827" }}>
                <thead style={{ borderBottom: "2px solid #374151" }}>
                  <tr>
                    <th className="text-uppercase small text-white font-monospace border-0">ID</th>
                    <th className="text-uppercase small text-white border-0">Paciente</th>
                    <th className="text-uppercase small text-white border-0">Servicio Contratado</th>
                    <th className="text-uppercase small text-white border-0">Fecha</th>
                    <th className="text-uppercase small text-white border-0">Monto</th>
                    <th className="text-uppercase small text-white border-0">Estado</th>
                    <th className="text-end text-uppercase small text-white border-0">Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-secondary">
                        No hay compras que coincidan con el criterio de búsqueda.
                      </td>
                    </tr>
                  ) : (
                    comprasFiltradas.map((compra) => (
                      <tr key={`compra-${compra.id}`} style={{ borderBottom: "1px solid #374151" }}>
                        <td className="small font-monospace text-secondary">
                          #CMP-{String(compra.id).padStart(4, "0")}
                        </td>
                        <td>
                          <div className="fw-semibold text-white">
                            {compra.usuario?.nombre || "Paciente Registrado"}
                          </div>
                          <div className="small font-monospace text-secondary">
                            {compra.usuario?.email || "-"}
                          </div>
                        </td>
                        <td className="fw-semibold text-white">{compra.nombre}</td>
                        <td className="font-monospace small text-secondary">{compra.fechaCompra}</td>
                        <td className="font-monospace fw-bold text-success">
                          {formatPriceCLP(compra.monto)}
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 ${
                              compra.estado === "Activo"
                                ? "bg-success bg-opacity-25 text-success"
                                : compra.estado === "Completado"
                                  ? "bg-primary bg-opacity-25 text-primary"
                                  : "bg-danger bg-opacity-25 text-danger"
                            }`}
                          >
                            {compra.estado}
                          </span>
                        </td>
                        <td className="text-end" style={{ minWidth: "170px" }}>
                          <select
                            aria-label={`Cambiar estado de compra ${compra.id}`}
                            className="form-select form-select-sm bg-dark text-white border-secondary d-inline-block w-auto"
                            value={compra.estado}
                            onChange={(e) =>
                              void handleCambiarEstadoCompra(
                                compra.id,
                                e.target.value as EstadoCompra,
                              )
                            }
                          >
                            <option value="Activo">Activo</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Citas Clínicas */}
        {(filtroTipoOperacion === "todas" || filtroTipoOperacion === "citas") && (
          <div>
            <h6 className="fw-bold text-warning text-uppercase small mb-3 font-monospace">
              📅 Citas Clínicas y Solicitudes ({citasFiltradas.length})
            </h6>
            <div className="table-responsive rounded-3 overflow-hidden" style={{ border: "1px solid #374151" }}>
              <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: "#111827" }}>
                <thead style={{ borderBottom: "2px solid #374151" }}>
                  <tr>
                    <th className="text-uppercase small text-white font-monospace border-0">ID</th>
                    <th className="text-uppercase small text-white border-0">Paciente</th>
                    <th className="text-uppercase small text-white border-0">Prestación</th>
                    <th className="text-uppercase small text-white border-0">Profesional</th>
                    <th className="text-uppercase small text-white border-0">Fecha y Hora</th>
                    <th className="text-uppercase small text-white border-0">Estado</th>
                    <th className="text-end text-uppercase small text-white border-0">Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {citasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-secondary">
                        No hay citas que coincidan con el criterio de búsqueda.
                      </td>
                    </tr>
                  ) : (
                    citasFiltradas.map((cita) => (
                      <tr key={`cita-${cita.id}`} style={{ borderBottom: "1px solid #374151" }}>
                        <td className="small font-monospace text-secondary">
                          #CIT-{String(cita.id).padStart(4, "0")}
                        </td>
                        <td>
                          <div className="fw-semibold text-white">
                            {cita.pacienteNombre || cita.usuario?.nombre || "Paciente"}
                          </div>
                          <div className="small font-monospace text-secondary">
                            {cita.pacienteEmail || cita.usuario?.email || "-"}
                          </div>
                        </td>
                        <td className="fw-semibold text-white">{cita.tipo}</td>
                        <td className="text-info">{cita.profesional}</td>
                        <td className="font-monospace small text-white">
                          {cita.fecha} <span className="text-secondary">({cita.hora})</span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 ${
                              cita.estado === "Completada"
                                ? "bg-success bg-opacity-25 text-success"
                                : cita.estado === "Confirmada"
                                  ? "bg-info bg-opacity-25 text-info"
                                  : cita.estado === "Programada"
                                    ? "bg-warning bg-opacity-25 text-warning"
                                    : "bg-danger bg-opacity-25 text-danger"
                            }`}
                          >
                            {cita.estado}
                          </span>
                        </td>
                        <td className="text-end" style={{ minWidth: "170px" }}>
                          <select
                            aria-label={`Cambiar estado de cita ${cita.id}`}
                            className="form-select form-select-sm bg-dark text-white border-secondary d-inline-block w-auto"
                            value={cita.estado}
                            onChange={(e) =>
                              void handleCambiarEstadoCitaAdmin(
                                cita.id,
                                e.target.value as EstadoCita,
                              )
                            }
                          >
                            <option value="Programada">Programada</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Completada">Completada</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="p-4 rounded-4 shadow-lg border-0" style={{ background: '#1f2937', color: '#f3f4f6', animation: "fadeSlideUp 0.3s var(--ease-spring)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bolder mb-0 tracking-tight">Catálogo de Servicios</h5>
        <button type="button" className="btn btn-sm fw-bold" style={{ background: '#3b82f6', color: 'white' }} onClick={abrirCrearServicio}>
          + Nuevo Servicio
        </button>
      </div>

      <div className="row g-3 align-items-end mb-3">
        <div className="col-12 col-md-7">
          <label className="form-label small text-secondary" htmlFor="buscar-servicios-admin">
            Buscar servicio
          </label>
          <input
            id="buscar-servicios-admin"
            type="search"
            className="form-control bg-dark text-white border-secondary"
            placeholder="Nombre, ID o categoría..."
            value={busquedaServicios}
            onChange={(event) => {
              setBusquedaServicios(event.target.value);
              setPaginaServicios(1);
            }}
          />
        </div>
        <div className="col-12 col-md-5 text-md-end small text-secondary" aria-live="polite">
          Mostrando {primerServicio}–{ultimoServicio} de {serviciosFiltrados.length} servicios
        </div>
      </div>

      <div className="table-responsive rounded-3 overflow-hidden" style={{ border: '1px solid #374151' }}>
        <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: '#111827' }}>
          <thead style={{ borderBottom: '2px solid #374151' }}>
            <tr>
              <th className="text-uppercase small text-white font-monospace border-0">ID</th>
              <th className="text-uppercase small text-white border-0">Nombre del Servicio</th>
              <th className="text-uppercase small text-white border-0">Categoría</th>
              <th className="text-uppercase small text-white border-0">Precio</th>
              <th className="text-uppercase small text-white border-0">Estado</th>
              <th className="text-end text-uppercase small text-white border-0">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 text-white">No se encontraron servicios registrados.</td></tr>
            ) : (
              serviciosPagina.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #374151' }}>
                  <td className="small font-monospace" style={{ color: '#9ca3af' }}>{s.id}</td>
                  <td className="fw-semibold text-white"><span className="me-2">{s.icono}</span>{s.nombre}</td>
                  <td><span className="badge rounded-pill" style={{ background: '#374151', color: '#d1d5db' }}>{s.categoriaNombre || "General"}</span></td>
                  <td style={{ color: '#10b981' }}>{formatPriceCLP(s.precio)}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 ${s.estado === "Activo" ? "bg-success bg-opacity-25 text-success" : "bg-secondary bg-opacity-25 text-secondary"}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-link text-info text-decoration-none me-2" onClick={() => abrirEditarServicio(s)}>Editar</button>
                    <button type="button" className={`btn btn-sm rounded-pill fw-bold px-3 ${s.estado === "Activo" ? "btn-outline-warning" : "btn-outline-success"}`} onClick={() => handleToggleEstado(s.id)}>
                      {s.estado === "Activo" ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pt-3">
        <span className="small text-secondary">Máximo 5 servicios por página</span>
        <div className="d-flex align-items-center gap-2">
          <span className="small text-secondary">
            Página {paginaServiciosActual} de {totalPaginasServicios}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            aria-label="Página anterior de servicios"
            disabled={paginaServiciosActual <= 1}
            onClick={() => setPaginaServicios((pagina) => Math.max(1, pagina - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            aria-label="Página siguiente de servicios"
            disabled={paginaServiciosActual >= totalPaginasServicios}
            onClick={() =>
              setPaginaServicios((pagina) =>
                Math.min(totalPaginasServicios, pagina + 1),
              )
            }
          >
            Siguiente
          </button>
        </div>
      </div>
      <ModalProducto isOpen={modalProducto} servicioEditar={servicioAEditar} categorias={categorias} onClose={() => setModalProducto(false)} onSave={handleGuardarServicio} />
    </div>
  );

  const renderCategories = () => (
    <div className="p-4 rounded-4 shadow-lg border-0" style={{ background: '#1f2937', color: '#f3f4f6', animation: "fadeSlideUp 0.3s var(--ease-spring)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bolder mb-0 tracking-tight">Categorías Clínicas</h5>
        <button type="button" className="btn btn-sm fw-bold" style={{ background: '#10b981', color: 'white' }} onClick={() => setModalCrearCategoria(true)}>
          + Nueva Categoría
        </button>
      </div>

      <div className="table-responsive rounded-3 overflow-hidden" style={{ border: '1px solid #374151' }}>
        <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: '#111827' }}>
          <thead style={{ borderBottom: '2px solid #374151' }}>
            <tr>
              <th className="text-uppercase small text-white font-monospace border-0">ID</th>
              <th className="text-uppercase small text-white border-0">Nombre</th>
              <th className="text-uppercase small text-white border-0">Descripción</th>
              <th className="text-uppercase small text-white border-0">Servicios Vinculados</th>
              <th className="text-end text-uppercase small text-white border-0">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-white">No existen categorías creadas.</td></tr>
            ) : (
              categorias.map((cat: Categoria) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #374151' }}>
                  <td className="small font-monospace" style={{ color: '#9ca3af' }}>{cat.id}</td>
                  <td className="fw-semibold text-white">{cat.nombre}</td>
                  <td className="small text-secondary">{cat.descripcion || "-"}</td>
                  <td><span className="badge bg-primary bg-opacity-25 text-primary rounded-pill px-3">{cat.serviciosAsociados ?? 0}</span></td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-link text-info text-decoration-none me-2" onClick={() => setCategoriaEditar({ ...cat })}>Editar</button>
                    <button type="button" className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => setCategoriaEliminar(cat)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ModalCategoria isOpen={modalCrearCategoria || Boolean(categoriaEditar)} categoriaEditar={categoriaEditar} categoriaEliminar={categoriaEliminar} onClose={() => { setModalCrearCategoria(false); setCategoriaEditar(null); setCategoriaEliminar(null); }} onSave={handleGuardarCategoria} onDeleteConfirm={EliminarCategoria} />
    </div>
  );

  const renderUsers = () => (
    <div className="p-4 rounded-4 shadow-lg border-0" style={{ background: '#1f2937', color: '#f3f4f6', animation: "fadeSlideUp 0.3s var(--ease-spring)" }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <h5 className="fw-bolder mb-0 tracking-tight">Cuentas de Usuario</h5>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control form-control-sm border-0 bg-dark text-white shadow-none"
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ borderRadius: '8px' }}
          />
          <button type="button" className="btn btn-sm fw-bold text-nowrap" style={{ background: '#f59e0b', color: '#fff' }} onClick={() => setModalCrearUsuario(true)}>
            + Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="table-responsive rounded-3 overflow-hidden" style={{ border: '1px solid #374151' }}>
        <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: '#111827' }}>
          <thead style={{ borderBottom: '2px solid #374151' }}>
            <tr>
              <th className="text-uppercase small text-white border-0">Nombre Completo</th>
              <th className="text-uppercase small text-white border-0">Correo Electrónico</th>
              <th className="text-uppercase small text-white border-0">Rol del Sistema</th>
              <th className="text-uppercase small text-white border-0">Estado</th>
              <th className="text-end text-uppercase small text-white border-0">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-white">No se encontraron cuentas que coincidan.</td></tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.email} style={{ borderBottom: '1px solid #374151' }}>
                  <td className="fw-semibold text-white">{u.nombre}</td>
                  <td className="font-monospace small" style={{ color: '#9ca3af' }}>{u.email}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-1 ${u.rol === "admin" ? "bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50" : u.rol === "nutricionista" ? "bg-success bg-opacity-25 text-success" : "bg-primary bg-opacity-25 text-primary"}`}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td><span className="badge bg-success text-white rounded-pill px-3">ACTIVO</span></td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-link text-info text-decoration-none me-2" onClick={() => { setUsuarioAEditar({ ...u }); setEmailOriginal(u.email); }}>Editar</button>
                    {u.rol !== "admin" && (
                      <button type="button" className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => setUsuarioAEliminar(u)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ModalCrearUsuario isOpen={modalCrearUsuario} onClose={() => setModalCrearUsuario(false)} onSave={handleCrearUsuario} />
      <ModalUsuario usuarioEditar={usuarioAEditar} usuarioEliminar={usuarioAEliminar} onClose={() => { setUsuarioAEditar(null); setUsuarioAEliminar(null); }} onSave={guardarEdicion} onDeleteConfirm={confirmarEliminacion} />
    </div>
  );

  const renderTerminal = () => (
    <div 
      className="rounded-4 shadow-lg d-flex flex-column" 
      style={{ height: '600px', background: '#000000', border: '1px solid #374151', animation: "fadeIn 0.3s ease-out" }}
    >
      <div className="d-flex align-items-center px-3 py-2 flex-shrink-0" style={{ background: '#1f2937', borderBottom: '1px solid #374151' }}>
        <div className="d-flex gap-2">
          <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#ef4444' }}></div>
          <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b' }}></div>
          <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#10b981' }}></div>
        </div>
        <div className="mx-auto fw-bold font-monospace small text-white">root@alchemax-core:~</div>
      </div>
      
      {/* Área Expandida de Foco. Haciendo clic aquí se auto-enfoca el input */}
      <div 
        ref={terminalContainerRef} 
        className="p-3 flex-grow-1 overflow-auto font-monospace position-relative" 
        style={{ color: '#10b981', fontSize: '0.9rem', cursor: 'text' }}
        onClick={handleTerminalFocus}
      >
        {terminalHistory.map((item) => (
          <div key={item.id} className="mb-1">
            {item.type === 'cmd' ? (
              <div><span className="text-white">root@alchemax ~$</span> {item.content}</div>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', color: '#d1d5db', fontFamily: 'inherit', margin: 0 }}>
                {item.content}
              </pre>
            )}
          </div>
        ))}
        <div className="d-flex align-items-center mt-1">
          <span className="text-white me-2">root@alchemax ~$</span>
          <input 
            ref={terminalInputRef}
            type="text" 
            className="bg-transparent border-0 text-white outline-none flex-grow-1 shadow-none font-monospace p-0"
            value={currentCmd}
            onChange={(e) => setCurrentCmd(e.target.value)}
            onKeyDown={handleTerminalCommand}
            autoFocus
            style={{ outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard": return renderDashboard();
      case "operations": return renderOperations();
      case "products": return renderProducts();
      case "categories": return renderCategories();
      case "users": return renderUsers();
      case "terminal": return renderTerminal();
      default: return renderDashboard();
    }
  };

  return (
    <main className="container-fluid py-4 px-3 px-md-5" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      {notificacion && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1100, marginTop: "75px" }}>
          <div className="p-3 rounded-3 shadow-lg d-flex align-items-center gap-3 border border-secondary" style={{ background: '#1f2937', color: '#f3f4f6' }}>
            <span>{notificacion.tipo === "success" ? "🟢" : notificacion.tipo === "danger" ? "🔴" : "🔵"}</span>
            <span className="fw-bold font-monospace small">{notificacion.texto}</span>
            <button type="button" className="btn-close btn-close-white" onClick={() => setNotificacion(null)}></button>
          </div>
        </div>
      )}

      <div className="row g-4">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <section className="col-lg-9 col-md-8">
          <div className="p-4 rounded-4 shadow-sm mb-4 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: 'white' }}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary rounded-pill px-3 py-1 fw-bold font-monospace">CONSOLA DE ADMINISTRACIÓN ALCHEMAX</span>
              </div>
              <h3 className="fw-bolder mb-1 tracking-tight">Administración del Sistema</h3>
              <p className="mb-0 text-white small font-monospace">
                {activeTab === "dashboard" && "Reportes ejecutivos, ingresos reales, ranking de servicios y métricas por período."}
                {activeTab === "operations" && "Supervisión y actualización de estados de compras y citas clínicas en base de datos."}
                {activeTab === "products" && "Control de base de datos para servicios y planes clínicos."}
                {activeTab === "categories" && "Gestión de estructura taxonómica de especialidades."}
                {activeTab === "users" && "Control de accesos y gestión de identidades de usuarios."}
                {activeTab === "terminal" && "Entorno de ejecución por interfaz de línea de comandos."}
              </p>
            </div>
            <div className="d-none d-sm-block fs-1 opacity-75">⚙️</div>
          </div>

          {renderActiveContent()}
        </section>
      </div>
    </main>
  );
}