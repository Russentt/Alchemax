import { useEffect, useState, type JSX } from "react";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import AdminStatCard from "../components/admin/AdminStatCard";
import type { Categoria, Usuario, Servicio } from "../data/types";
import { StorageUsuario } from "../services/storageUsuario";
import { useNavigate } from "react-router";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";
import ModalProducto from "../components/admin/ModalProducto";
import ModalCategoria from "../components/admin/ModalCategoria";
import ModalUsuario from "../components/admin/ModalUsuario";
import ModalCrearUsuario from "../components/admin/ModalCrearUsuario";


export default function Admin(): JSX.Element {
  // State controls which administrative view is currently rendered
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const navigate = useNavigate();

  useEffect(() => {
    const sesion = StorageUsuario.getUsuarioSesion();

    if (!sesion || sesion.rol !== 'admin') {
      navigate("/login");
    }
  }, [navigate]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [emailOriginal, setEmailOriginal] = useState<string>("");

  // Estados de categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);
  const [modalCrearCategoria, setModalCrearCategoria] = useState(false);
  

  const cargarCategorias = () => {
    setCategorias(StorageCategorias.getCategorias());
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleGuardarCategoria = (
    datos: Omit<Categoria, "id" | "serviciosAsociados">
  ) => {
    if (categoriaEditar) {
      const res = StorageCategorias.updateCategoria({
        ...categoriaEditar,
        ...datos,
      });

      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return;
      }
      mostrarNotificacion("Categoría actualizada", "success");
    } else {
      const res = StorageCategorias.crearCategoria(datos);

      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return;
      }
      mostrarNotificacion("Categoría creada", "success");
    }

    cargarCategorias();
    setModalCrearCategoria(false);
    setCategoriaEditar(null);
  };

  // Esta se mantiene igual (la invoca el modal en onDeleteConfirm):
  const EliminarCategoria = () => {
    if (!categoriaEliminar) return;

    StorageCategorias.deleteCategoria(categoriaEliminar.id);
    cargarCategorias();
    mostrarNotificacion(`Categoría "${categoriaEliminar.nombre}" eliminada`, "success");
    setCategoriaEliminar(null);
  };

  const [notificacion, setNotificacion] = useState<{
    texto: string;
    tipo: "info" | "success" | "danger";
  } | null>(null);


  // Estados de productos
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [modalProducto, setModalProducto] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);

  

  const cargarServicios = () => {
    setServicios(StorageServicios.getServicios());
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // Crear servicio en modal
  const abrirCrearServicio = () => {
    setServicioAEditar(null);
    setModalProducto(true);
  };

  // Edicion en modal
  const abrirEditarServicio = (item: Servicio) => {
    setServicioAEditar(item);
    setModalProducto(true);
  };

  // Guardar (Crear o Modificar)
  const handleGuardarServicio = (
    datos: Omit<Servicio, "id" | "estado">
  ) => {
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
        return;
      }
      mostrarNotificacion("Servicio actualizado", "success");
    } else {
      const res = StorageServicios.crearServicio({
        ...datos,
        categoriaNombre: nombreCategoria,
        estado: "Activo",
      });

      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return;
      }
      mostrarNotificacion("Servicio creado", "success");
    }

    cargarServicios();
    cargarCategorias();
    setModalProducto(false);
    setServicioAEditar(null);
      
  };

  // Alternar Activo / Inactivo
  const handleToggleEstado = (id: string) => {
    StorageServicios.toggleEstado(id);
    cargarServicios();
    mostrarNotificacion("Estado actualizado.", "info");
  };


  // Estados de usuarios

  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  const cargarUsuario = () => {
    setUsuarios(StorageUsuario.getUsuarios());
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

  const mostrarNotificacion = (
    texto: string,
    tipo: "info" | "success" | "danger" = "info"
  ) => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  
  const confirmarEliminacion = () => {
    if (!usuarioAEliminar) return;
    StorageUsuario.deleteUsuario(usuarioAEliminar.email);
    cargarUsuario();
    mostrarNotificacion(
      `Usuario ${usuarioAEliminar.nombre} eliminado.`,
      "success"
    );
    setUsuarioAEliminar(null);
  };

  const guardarEdicion = (usuarioActualizado: Usuario) => {
    const respuesta = StorageUsuario.updateUsuario(usuarioActualizado, emailOriginal);

    if (!respuesta.success) {
      mostrarNotificacion(respuesta.mensaje, "danger");
      return;
    }

    cargarUsuario();
    mostrarNotificacion("Usuario actualizado con éxito.", "success");
    setUsuarioAEditar(null);
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const termino = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(termino) ||
      u.email.toLowerCase().includes(termino)
    );
  });

  const [modalCrearUsuario, setModalCrearUsuario] = useState(false);

  const handleCrearUsuario = (nuevoUsuario: Usuario) => {
  const usuariosActuales = StorageUsuario.getUsuarios();
  const existe = usuariosActuales.some(
    (u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase()
  );

  if (existe) {
    mostrarNotificacion("Ese correo electrónico ya está registrado.", "danger");
    return;
  }

  usuariosActuales.push(nuevoUsuario);
  localStorage.setItem("db_usuarios", JSON.stringify(usuariosActuales));

  cargarUsuario();
  setModalCrearUsuario(false);
  mostrarNotificacion("Usuario registrado exitosamente.", "success");
};

  // Sub-view: Dashboard (Metrics & Previews)
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <AdminStatCard
          title="Total Productos"
          value={servicios.length}
          icon="🛒"
          theme="success"
        />
        <AdminStatCard
          title="Categorías Activas"
          value={categorias.length}
          icon="📁"
          theme="info"
        />
        <AdminStatCard
          title="Pacientes Registrados"
          value={usuarios.length}
          icon="👥"
          theme="warning"
        />
      </div>
      <div className="bg-white p-4 rounded-4 shadow-sm border-0">
        <h5 className="fw-bold text-dark mb-3">
          Actividad Reciente del Sistema
        </h5>
        <p className="text-muted">
          El sistema está operando con normalidad. No hay alertas críticas de
          stock ni errores de base de datos.
        </p>
      </div>
    </>
  );

  // Catálogo de Servicios
  const renderProducts = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Catálogo de Servicios y Planes</h5>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
          onClick={abrirCrearServicio}
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre del Plan</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {servicios.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No hay productos ni planes registrados.
                </td>
              </tr>
            ) : (
              servicios.map((s) => (
                <tr key={s.id}>
                  <td className="text-muted small fw-bold">#{s.id}</td>
                  <td className="fw-semibold">
                    <span className="me-2">{s.icono}</span>
                    {s.nombre}
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary">
                      {s.categoriaNombre || "Sin categoría"}
                    </span>
                  </td>
                  <td>${Number(s.precio).toLocaleString("es-CL")}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.estado === "Activo" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-light text-primary me-2"
                      onClick={() => abrirEditarServicio(s)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm btn-light ${
                        s.estado === "Activo" ? "text-danger" : "text-success"
                      }`}
                      onClick={() => handleToggleEstado(s.id)}
                    >
                      {s.estado === "Activo" ? "Bajar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de productos */}
      <ModalProducto
        isOpen={modalProducto}
        servicioEditar={servicioAEditar}
        categorias={categorias}
        onClose={() => setModalProducto(false)}
        onSave={handleGuardarServicio}
      />
    </div>
  );


  // Sub-view: Categories Management
  const renderCategories = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Gestión de Categorías</h5>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
          onClick={() => setModalCrearCategoria(true)}
        >
          + Nueva Categoría
        </button>
      </div>

      {notificacion && (
        <div className={`alert alert-${notificacion.tipo} py-2 px-3 small border-0`}>
          {notificacion.texto}
        </div>
      )}

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>ID Categoría</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Servicios Asociados</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              categorias.map((cat: Categoria) => (
                <tr key={cat.id}>
                  <td className="text-muted small fw-bold">#{cat.id}</td>
                  <td className="fw-semibold">{cat.nombre}</td>
                  <td className="text-muted small">{cat.descripcion || "-"}</td>
                  <td>{cat.serviciosAsociados ?? 0}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-light text-primary me-2"
                      onClick={() => setCategoriaEditar({ ...cat })}
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => setCategoriaEliminar(cat)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal de Categorías */}
      <ModalCategoria
        isOpen={modalCrearCategoria || Boolean(categoriaEditar)}
        categoriaEditar={categoriaEditar}
        categoriaEliminar={categoriaEliminar}
        onClose={() => {
          setModalCrearCategoria(false);
          setCategoriaEditar(null);
          setCategoriaEliminar(null);
        }}
        onSave={handleGuardarCategoria}
        onDeleteConfirm={EliminarCategoria}
      />
    </div>
  );

  // Sub-view: User Accounts Management
  const renderUsers = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Administración de Cuentas</h5>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold text-nowrap"
            onClick={() => setModalCrearUsuario(true)}
          >
            + Nuevo Usuario
          </button>
        </div>
      </div>

      {notificacion && (
        <div
          className={`alert alert-${notificacion.tipo} py-2 px-3 small d-flex justify-content-between align-items-center mb-3 border-0`}
          role="alert"
        >
          <span>{notificacion.texto}</span>
          <button
            type="button"
            className="btn-close small"
            style={{ fontSize: "0.65rem" }}
            aria-label="Cerrar"
            onClick={() => setNotificacion(null)}
          ></button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Rol del Sistema</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No se encontraron usuarios registrados.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.email}>
                  <td className="fw-semibold">{u.nombre}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.rol === "admin"
                          ? "bg-danger-subtle text-danger"
                          : "bg-primary-subtle text-primary"
                      }`}
                    >
                      {u.rol === "admin" ? "Administrador" : "Paciente"}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-success">Activo</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-light text-primary me-2"
                      onClick={() => {
                        setUsuarioAEditar({ ...u });
                        setEmailOriginal(u.email);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => setUsuarioAEliminar(u)}
                    >
                      Eliminar
                    </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        
        {/* Modal Crear Usuario */}
        <ModalCrearUsuario
          isOpen={modalCrearUsuario}
          onClose={() => setModalCrearUsuario(false)}
          onSave={handleCrearUsuario}
        />

        {/* Modal de usuarios (Editar/ Eliminar)  */}    
        <ModalUsuario
            usuarioEditar={usuarioAEditar}
            usuarioEliminar={usuarioAEliminar}
            onClose={() => {
              setUsuarioAEditar(null);
              setUsuarioAEliminar(null);
            }}
            onSave={guardarEdicion}
            onDeleteConfirm={confirmarEliminacion}
          />
        </div>
      );

  // Dynamic router logic to swap the main content
  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "categories":
        return renderCategories();
      case "users":
        return renderUsers();
      default:
        return renderDashboard();
    }
  };

  return (
    <main className="container-fluid py-4 px-4 px-md-5 bg-light flex-grow-1">
      <div className="row g-4">
        {/* The Sidebar is passed the current state and the setter function */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="col-lg-9 col-md-8">
          {/* Persistent Header */}
          <div className="bg-dark text-white p-4 rounded-4 shadow-sm mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold mb-1">Panel de Control</h3>
              <p className="mb-0 text-white-50">
                {activeTab === "dashboard" &&
                  "Gestiona los recursos y métricas de NutriVida."}
                {activeTab === "products" &&
                  "Administra el catálogo de servicios ofrecidos."}
                {activeTab === "categories" &&
                  "Configura la estructura del catálogo."}
                {activeTab === "users" &&
                  "Control de permisos y cuentas de pacientes."}
              </p>
            </div>
            <div className="d-none d-sm-block fs-1">⚙️</div>
          </div>

          {/* Render the selected view */}
          {renderActiveContent()}
        </section>
      </div>
    </main>
  );
}
