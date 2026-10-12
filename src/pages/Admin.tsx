import { useEffect, useState, type JSX } from "react";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import AdminStatCard from "../components/admin/AdminStatCard";
import type { Categoria, Usuario, Servicio } from "../data/types";
import { StorageUsuario } from "../services/storageUsuario";
import { useNavigate } from "react-router";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";


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
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion: "" });

  const cargarCategorias = () => {
    setCategorias(StorageCategorias.getCategorias());
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  const CrearCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if(!nuevaCategoria.nombre.trim()) return;

    const res = StorageCategorias.crearCategoria(nuevaCategoria);
    if(!res.success) {
      mostrarNotificacion(res.mensaje, "danger");
      return;
    }

    cargarCategorias();
    setNuevaCategoria({ nombre: "", descripcion: "" });
    setModalCrearCategoria(false);
    mostrarNotificacion("Categoria creada", "success");
  };

  const gardarEdicionCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoriaEditar) return;

    const res = StorageCategorias.updateCategoria(categoriaEditar);
    if (!res.success) {
      mostrarNotificacion(res.mensaje, "danger");
      return;
    }

    cargarCategorias();
    setCategoriaEditar(null);
    mostrarNotificacion("Categoria actualizada", "success");
  };

  const EliminarCategoria = () => {
    if (!categoriaEliminar) return;

    StorageCategorias.deleteCategoria(categoriaEliminar.id);
    cargarCategorias();
    mostrarNotificacion(`Categoria "${categoriaEliminar.nombre}" eliminada`, "success" );
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

  const [formServicio, setFormServicio] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    tipo: "plan" as "evaluacion" | "plan" | "control",
    icono: "🥗",
    categoriaId: "",
  });

  const cargarServicios = () => {
    setServicios(StorageServicios.getServicios());
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // Crear servicio en modal
  const abrirCrearServicio = () => {
    setServicioAEditar(null);
    setFormServicio({
      nombre: "",
      descripcion: "",
      precio: 0,
      tipo: "plan",
      icono: "🥗",
      categoriaId: categorias.length > 0 ? categorias[0].id : "",
    });
    setModalProducto(true);
  };

  // Edicion en modal
  const abrirEditarServicio = (item: Servicio) => {
    setServicioAEditar(item);
    setFormServicio({
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      precio: item.precio,
      tipo: item.tipo,
      icono: item.icono || "🥗",
      categoriaId: item.categoriaId,
    });
    setModalProducto(true);
  };

  // Guardar (Crear o Modificar)
  const handleGuardarServicio = (e: React.FormEvent) => {
    e.preventDefault();

    const categoriaEncontrada = categorias.find((c) => c.id === formServicio.categoriaId);
    const nombreCategoria = categoriaEncontrada ? categoriaEncontrada.nombre : "General";

    if (servicioAEditar) {
      const res = StorageServicios.updateServicio({
        ...servicioAEditar,
        ...formServicio,
        categoriaNombre: nombreCategoria,
      });

      if (!res.success) {
        mostrarNotificacion(res.mensaje, "danger");
        return;
      }
      mostrarNotificacion("Servicio actualizado", "success");
    } else {
      const res = StorageServicios.crearServicio({
        ...formServicio,
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
      {modalProducto && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  {servicioAEditar ? "Modificar Plan" : "Nuevo Plan / Servicio"}
                </h6>
                <button
                  type="button"
                  className="btn-close small"
                  onClick={() => setModalProducto(false)}
                />
              </div>

              <form onSubmit={handleGuardarServicio} className="d-flex flex-column gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nombre del Plan"
                  value={formServicio.nombre}
                  onChange={(e) => setFormServicio({ ...formServicio, nombre: e.target.value })}
                  required
                />

                <select
                  className="form-select form-select-sm"
                  value={formServicio.categoriaId}
                  onChange={(e) => setFormServicio({ ...formServicio, categoriaId: e.target.value })}
                  required
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>

                <div className="row g-2">
                  <div className="col-7">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Precio ($ CLP)"
                      value={formServicio.precio || ""}
                      onChange={(e) =>
                        setFormServicio({ ...formServicio, precio: Number(e.target.value) })
                      }
                      min={0}
                      required
                    />
                  </div>
                  <div className="col-5">
                    <select
                      className="form-select form-select-sm"
                      value={formServicio.tipo}
                      onChange={(e) =>
                        setFormServicio({
                          ...formServicio,
                          tipo: e.target.value as "evaluacion" | "plan" | "control",
                        })
                      }
                    >
                      <option value="plan">Plan</option>
                      <option value="evaluacion">Evaluación</option>
                      <option value="control">Control</option>
                    </select>
                  </div>
                </div>

                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  placeholder="Descripción breve..."
                  value={formServicio.descripcion}
                  onChange={(e) => setFormServicio({ ...formServicio, descripcion: e.target.value })}
                />

                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => setModalProducto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-sm btn-success fw-bold">
                    {servicioAEditar ? "Guardar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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


      {/* 1. Modal Crear / Editar Categoría */}
      {(modalCrearCategoria || categoriaEditar) && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0">
                  {categoriaEditar ? "Modificar Categoría" : "Nueva Categoría"}
                </h5>
                <button
                  type="button"
                  className="btn-close small"
                  onClick={() => {
                    setModalCrearCategoria(false);
                    setCategoriaEditar(null);
                  }}
                />
              </div>

              <form onSubmit={categoriaEditar ? gardarEdicionCategoria : CrearCategoria}>
                <div className="mb-2">
                  <label className="form-label small fw-semibold text-muted">Nombre</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={categoriaEditar ? categoriaEditar.nombre : nuevaCategoria.nombre}
                    onChange={(e) =>
                      categoriaEditar
                        ? setCategoriaEditar({ ...categoriaEditar, nombre: e.target.value })
                        : setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Descripción</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={categoriaEditar ? (categoriaEditar.descripcion || "") : nuevaCategoria.descripcion}
                    onChange={(e) =>
                      categoriaEditar
                        ? setCategoriaEditar({ ...categoriaEditar, descripcion: e.target.value })
                        : setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })
                    }
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => {
                      setModalCrearCategoria(false);
                      setCategoriaEditar(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-sm btn-success fw-bold">
                    {categoriaEditar ? "Guardar Cambios" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Eliminar */}
      {categoriaEliminar && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-4 border-0 p-3 shadow text-center">
              <h6 className="fw-bold text-danger mb-2">Eliminar Categoría</h6>
              <p className="small text-muted mb-3">
                ¿Seguro que deseas eliminar <strong>{categoriaEliminar.nombre}</strong>?
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => setCategoriaEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger fw-bold"
                  onClick={EliminarCategoria}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
