import { useEffect, useState, type JSX } from "react";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import AdminStatCard from "../components/admin/AdminStatCard";
import type { Usuario } from "../data/types";
import { StorageUsuario } from "../services/storageUsuario";

export default function Admin(): JSX.Element {
  // State controls which administrative view is currently rendered
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [emailOriginal, setEmailOriginal] = useState<string>("");

  const [notificacion, setNotificacion] = useState<{
    texto: string;
    tipo: "info" | "success" | "danger";
  } | null>(null);

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

  const guardarEdicion = (e: React.FormEvent) => {
  e.preventDefault();
  if (!usuarioAEditar) return;

  const respuesta = StorageUsuario.updateUsuario(usuarioAEditar, emailOriginal);

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

  // Sub-view: Dashboard (Metrics & Previews)
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <AdminStatCard
          title="Total Productos"
          value={24}
          icon="🛒"
          theme="success"
        />
        <AdminStatCard
          title="Categorías Activas"
          value={5}
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

  const renderProducts = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">
          Catálogo de Servicios y Planes
        </h5>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
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
            <tr>
              <td className="text-muted small fw-bold">#PROD-101</td>
              <td className="fw-semibold">Plan Nutricional Deportivo</td>
              <td>
                <span className="badge bg-secondary-subtle text-secondary">
                  Planes Especializados
                </span>
              </td>
              <td>$45.000</td>
              <td>
                <span className="badge bg-success">Activo</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary me-2"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-danger"
                >
                  Bajar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
        >
          + Nueva Categoría
        </button>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>ID Categoría</th>
              <th>Nombre</th>
              <th>Servicios Asociados</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-muted small fw-bold">#CAT-01</td>
              <td className="fw-semibold">Evaluación Biométrica</td>
              <td>12</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary"
                >
                  Modificar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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


        {/* Box Para editar usuario  */}    
        {usuarioAEditar && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Editar Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUsuarioAEditar(null)}
                ></button>
              </div>
              <form onSubmit={guardarEdicion}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={usuarioAEditar.nombre}
                      onChange={(e) =>
                        setUsuarioAEditar({
                          ...usuarioAEditar,
                          nombre: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={usuarioAEditar.email}
                      onChange={(e) =>
                        setUsuarioAEditar({
                          ...usuarioAEditar,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Rol en el Sistema
                    </label>
                    <select
                      className="form-select"
                      value={usuarioAEditar.rol}
                      onChange={(e) =>
                        setUsuarioAEditar({
                          ...usuarioAEditar,
                          rol: e.target.value as "admin" | "usuario",
                        })
                      }
                    >
                      <option value="usuario">Paciente / Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setUsuarioAEditar(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success fw-bold">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Box para eliminacion de usuario */}
      {usuarioAEliminar && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">
                  Eliminar Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUsuarioAEliminar(null)}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="mb-1 text-dark">
                  ¿Seguro que deseas eliminar a{" "}
                  <strong>{usuarioAEliminar.nombre}</strong>?
                </p>
                <small className="text-muted">
                  Correo: {usuarioAEliminar.email}. Esta acción no se puede deshacer.
                </small>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setUsuarioAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={confirmarEliminacion}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
