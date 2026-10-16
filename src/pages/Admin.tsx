import { useEffect, useState, useRef, type JSX } from "react";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import AdminStatCard from "../components/admin/AdminStatCard";
import type { Categoria, Servicio, Usuario } from "../types/index";
import { StorageUsuario } from "../services/storageUsuario";
import { useNavigate } from "react-router";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";
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
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => StorageUsuario.getUsuarios());
  const [busqueda, setBusqueda] = useState("");
  const [emailOriginal, setEmailOriginal] = useState<string>("");
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: "info" | "success" | "danger"; } | null>(null);

  // Estados Categorías
  const [categorias, setCategorias] = useState<Categoria[]>(() => StorageCategorias.getCategorias());
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);
  const [modalCrearCategoria, setModalCrearCategoria] = useState(false);

  // Estados Servicios
  const [servicios, setServicios] = useState<Servicio[]>(() => StorageServicios.getServicios());
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

  // Estados Terminal CLI
  const [terminalHistory, setTerminalHistory] = useState<{ id: string; type: 'cmd' | 'output'; content: string | JSX.Element }[]>([
    { id: 'init1', type: 'output', content: 'Alchemax OS v11.0.4 (NutriVida Core Branch)' },
    { id: 'init2', type: 'output', content: 'Escribe "help" para ver la lista de comandos o "man [comando]" para el manual.' }
  ]);
  const [currentCmd, setCurrentCmd] = useState("");
  
  // Referencias para la UX de la Terminal
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

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
  const cargarCategorias = () => setCategorias(StorageCategorias.getCategorias());
  const cargarServicios = () => setServicios(StorageServicios.getServicios());
  const cargarUsuario = () => setUsuarios(StorageUsuario.getUsuarios());

  // Handlers Categorías
  const handleGuardarCategoria = (datos: Omit<Categoria, "id" | "serviciosAsociados">) => {
    if (categoriaEditar) {
      const res = StorageCategorias.updateCategoria({ ...categoriaEditar, ...datos });
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Área de especialidad actualizada", "success");
    } else {
      const res = StorageCategorias.crearCategoria(datos);
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Área de especialidad creada", "success");
    }
    cargarCategorias();
    setModalCrearCategoria(false);
    setCategoriaEditar(null);
  };

  const EliminarCategoria = () => {
    if (!categoriaEliminar) return;
    StorageCategorias.deleteCategoria(categoriaEliminar.id);
    cargarCategorias();
    mostrarNotificacion(`Área "${categoriaEliminar.nombre}" eliminada`, "success");
    setCategoriaEliminar(null);
  };

  // Handlers Servicios
  const abrirCrearServicio = () => { setServicioAEditar(null); setModalProducto(true); };
  const abrirEditarServicio = (item: Servicio) => { setServicioAEditar(item); setModalProducto(true); };

  const handleGuardarServicio = (datos: Omit<Servicio, "id" | "estado">) => {
    const categoriaEncontrada = categorias.find((c) => c.id === datos.categoriaId);
    const nombreCategoria = categoriaEncontrada ? categoriaEncontrada.nombre : "General";

    if (servicioAEditar) {
      const res = StorageServicios.updateServicio({ ...servicioAEditar, ...datos, categoriaNombre: nombreCategoria });
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Servicio clínico actualizado", "success");
    } else {
      const res = StorageServicios.crearServicio({ ...datos, categoriaNombre: nombreCategoria, estado: "Activo" });
      if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
      mostrarNotificacion("Servicio clínico creado", "success");
    }
    cargarServicios();
    cargarCategorias();
    setModalProducto(false);
    setServicioAEditar(null);
  };

  const handleToggleEstado = (id: string) => {
    StorageServicios.toggleEstado(id);
    cargarServicios();
    mostrarNotificacion("Visibilidad de servicio actualizada.", "info");
  };

  // Handlers Usuarios
  const handleCrearUsuario = (nuevoUsuario: Usuario) => {
    const usuariosActuales = StorageUsuario.getUsuarios();
    if (usuariosActuales.some((u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase())) {
      return mostrarNotificacion("La identidad de red ya existe.", "danger");
    }
    usuariosActuales.push(nuevoUsuario);
    localStorage.setItem("db_usuarios", JSON.stringify(usuariosActuales));
    cargarUsuario();
    setModalCrearUsuario(false);
    mostrarNotificacion("Identidad registrada exitosamente.", "success");
  };

  const confirmarEliminacion = () => {
    if (!usuarioAEliminar) return;
    StorageUsuario.deleteUsuario(usuarioAEliminar.email);
    cargarUsuario();
    mostrarNotificacion(`Identidad revocada del sistema.`, "success");
    setUsuarioAEliminar(null);
  };

  const guardarEdicion = (usuarioActualizado: Usuario) => {
    const res = StorageUsuario.updateUsuario(usuarioActualizado, emailOriginal);
    if (!res.success) return mostrarNotificacion(res.mensaje, "danger");
    cargarUsuario();
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

  const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = currentCmd.trim();
      const newHistory = [...terminalHistory, { id: `in-${Date.now()}`, type: 'cmd' as const, content: cmd }];
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
          } else {
            output = "usuarios/  servicios/  categorias/";
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
            const catToDelete = categorias.find(c => c.id === args[1]);
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
            const newU: Usuario = { email: args[1], nombre: args[2], rol: args[3] as any, password: "password123", genero: "otro", fechaNacimiento: "1990-01-01" };
            const uList = StorageUsuario.getUsuarios();
            if(uList.some(u => u.email === newU.email)) {
              output = `useradd: el correo ${newU.email} ya existe en el sistema.`;
            } else {
              uList.push(newU);
              localStorage.setItem("db_usuarios", JSON.stringify(uList));
              cargarUsuario();
              output = `Usuario ${newU.email} creado con éxito.`;
            }
          } else {
            output = "useradd: faltan argumentos. Uso: useradd [email] [nombre] [rol]";
          }
          break;
        case "userdel":
          if (args[1]) {
            StorageUsuario.deleteUsuario(args[1]);
            cargarUsuario();
            output = `Usuario ${args[1]} eliminado del sistema.`;
          } else {
            output = "userdel: faltan argumentos. Uso: userdel [email]";
          }
          break;
        case "svctoggle":
          if (args[1]) {
            StorageServicios.toggleEstado(args[1]);
            cargarServicios();
            output = `Estado del servicio ${args[1]} alternado exitosamente.`;
          } else {
            output = "svctoggle: faltan argumentos. Uso: svctoggle [id]";
          }
          break;
        default:
          output = `bash: command not found: ${args[0]}`;
      }

      if (output) {
        newHistory.push({ id: `out-${Date.now()}`, type: 'output', content: output });
      }

      setTerminalHistory(newHistory);
      setCurrentCmd("");
    }
  };

  // --- RENDERS DE VISTAS (DARK UI) ---
  const renderDashboard = () => (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="row g-4 mb-4">
        <AdminStatCard title="Servicios Activos" value={servicios.filter(s => s.estado === 'Activo').length} icon="📦" theme="primary" />
        <AdminStatCard title="Categorías Clínicas" value={categorias.length} icon="🗂️" theme="info" />
        <AdminStatCard title="Usuarios Registrados" value={usuarios.length} icon="👥" theme="warning" />
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
                {activeTab === "dashboard" && "Monitoreo de métricas globales y subsistemas activos."}
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