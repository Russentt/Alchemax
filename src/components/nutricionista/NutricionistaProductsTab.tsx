import { useState, type JSX } from "react";
import ModalProducto from "../admin/ModalProducto";
import type { Categoria, Servicio } from "../../types/index";
import { formatPriceCLP } from "../../utils/formatPriceCLP";

interface NutricionistaProductsTabProps {
  servicios: Servicio[];
  categorias: Categoria[];
  onSave: (
    datos: Omit<Servicio, "id" | "estado">,
    servicioEditar: Servicio | null,
  ) => boolean;
  onToggleState: (id: string) => void;
}

export default function NutricionistaProductsTab({
  servicios,
  categorias,
  onSave,
  onToggleState,
}: NutricionistaProductsTabProps): JSX.Element {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [tipoActivo, setTipoActivo] = useState("todos");
  const [estadoActivo, setEstadoActivo] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 4;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditar, setServicioEditar] = useState<Servicio | null>(null);

  const serviciosValidos = (Array.isArray(servicios) ? servicios : []).filter(
    (servicio): servicio is Servicio =>
      Boolean(
        servicio &&
          typeof servicio === "object" &&
          typeof servicio.id === "string" &&
          typeof servicio.nombre === "string",
      ),
  );
  const categoriasValidas = (Array.isArray(categorias) ? categorias : []).filter(
    (categoria): categoria is Categoria =>
      Boolean(
        categoria &&
          typeof categoria === "object" &&
          typeof categoria.id === "string" &&
          typeof categoria.nombre === "string",
      ),
  );
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase("es-CL");
  const serviciosFiltrados = serviciosValidos.filter((servicio) => {
    const textoServicio = [
      servicio.id,
      servicio.nombre,
      typeof servicio.descripcion === "string" ? servicio.descripcion : "",
      typeof servicio.categoriaNombre === "string"
        ? servicio.categoriaNombre
        : "",
    ]
      .join(" ")
      .toLocaleLowerCase("es-CL");
    const coincideTexto = textoServicio.includes(terminoBusqueda);
    const coincideCategoria =
      categoriaActiva === "todas" ||
      String(servicio.categoriaId) === String(categoriaActiva);
    const coincideTipo = tipoActivo === "todos" || servicio.tipo === tipoActivo;
    const coincideEstado =
      estadoActivo === "todos" || servicio.estado === estadoActivo;
    return coincideTexto && coincideCategoria && coincideTipo && coincideEstado;
  });
  const totalPaginas = Math.max(
    1,
    Math.ceil(serviciosFiltrados.length / filasPorPagina),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const serviciosPagina = serviciosFiltrados.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina,
  );
  const totalActivos = serviciosValidos.filter(
    (servicio) => servicio.estado === "Activo",
  ).length;
  const primerResultado =
    serviciosFiltrados.length === 0 ? 0 : (paginaActual - 1) * filasPorPagina + 1;
  const ultimoResultado = Math.min(
    paginaActual * filasPorPagina,
    serviciosFiltrados.length,
  );

  const abrirCrear = () => {
    setServicioEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (servicio: Servicio) => {
    setServicioEditar(servicio);
    setModalAbierto(true);
  };

  const guardarServicio = (datos: Omit<Servicio, "id" | "estado">) => {
    if (!onSave(datos, servicioEditar)) return;
    setModalAbierto(false);
    setServicioEditar(null);
  };

  return (
    <div
      className="glass-panel p-3 p-md-4 rounded-5 border-0"
      style={{ animation: "fadeSlideUp 0.35s var(--ease-spring)" }}
    >
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="small fw-bold text-success text-uppercase mb-1">Catálogo clínico</div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">Planes y prestaciones</h4>
          <p className="text-muted small mb-0">
            Busca, filtra y administra los servicios disponibles para pacientes.
          </p>
        </div>
        <button
          type="button"
          className="btn-kinetic-health py-2 px-4 border-0 shadow-sm"
          onClick={abrirCrear}
        >
          + Crear Nuevo Plan
        </button>
      </div>

      <div className="d-flex flex-wrap gap-3 small mb-3" aria-live="polite">
        <span className="text-muted">
          <strong className="text-dark">{serviciosValidos.length}</strong> servicios
        </span>
        <span className="text-muted">
          <strong className="text-success">{totalActivos}</strong> activos
        </span>
        <span className="text-muted">
          <strong className="text-secondary">
            {serviciosValidos.length - totalActivos}
          </strong>{" "}
          ocultos
        </span>
      </div>

      <div className="row g-3 mb-4 align-items-end">
        <div className="col-12 col-lg-4">
          <label className="form-label small fw-semibold text-muted" htmlFor="buscar-servicios">
            Buscar
          </label>
          <input
            id="buscar-servicios"
            type="search"
            className="form-control apple-input"
            placeholder="Nombre, código o descripción..."
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label small fw-semibold text-muted" htmlFor="filtro-categoria-servicios">
            Categoría
          </label>
          <select
            id="filtro-categoria-servicios"
            className="form-select apple-input fw-semibold"
            value={categoriaActiva}
            onChange={(event) => {
              setCategoriaActiva(event.target.value);
              setPagina(1);
            }}
          >
            <option value="todas">Todas las categorías</option>
            {categoriasValidas.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-lg-2">
          <label className="form-label small fw-semibold text-muted" htmlFor="filtro-tipo-servicios">
            Tipo
          </label>
          <select
            id="filtro-tipo-servicios"
            className="form-select apple-input fw-semibold"
            value={tipoActivo}
            onChange={(event) => {
              setTipoActivo(event.target.value);
              setPagina(1);
            }}
          >
            <option value="todos">Todos</option>
            <option value="plan">Plan</option>
            <option value="evaluacion">Evaluación</option>
            <option value="control">Control</option>
          </select>
        </div>
        <div className="col-6 col-lg-3">
          <label className="form-label small fw-semibold text-muted" htmlFor="filtro-estado-servicios">
            Visibilidad
          </label>
          <select
            id="filtro-estado-servicios"
            className="form-select apple-input fw-semibold"
            value={estadoActivo}
            onChange={(event) => {
              setEstadoActivo(event.target.value);
              setPagina(1);
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Oculto</option>
          </select>
        </div>
      </div>

      <div className="table-responsive rounded-4 bg-white border shadow-sm overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4 py-3 small text-uppercase text-muted">Código</th>
              <th className="py-3 small text-uppercase text-muted">Servicio / Plan</th>
              <th className="py-3 small text-uppercase text-muted">Categoría</th>
              <th className="py-3 small text-uppercase text-muted">Arancel</th>
              <th className="py-3 small text-uppercase text-muted">Visibilidad</th>
              <th className="pe-4 py-3 text-end small text-uppercase text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-muted">
                  {serviciosValidos.length === 0
                    ? "No hay servicios válidos para mostrar. Revisa los datos guardados del catálogo."
                    : "No se encontraron planes con los filtros aplicados."}
                </td>
              </tr>
            ) : (
              serviciosPagina.map((servicio) => (
                <tr key={servicio.id}>
                  <td className="ps-4 text-muted small fw-bold">#{servicio.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-4">{servicio.icono || "🥗"}</span>
                      <div>
                        <div className="fw-bolder text-dark">{servicio.nombre}</div>
                        <small className="text-muted">
                          {typeof servicio.tipo === "string" ? servicio.tipo : "Sin tipo"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border rounded-pill px-3">
                      {typeof servicio.categoriaNombre === "string"
                        ? servicio.categoriaNombre
                        : "General"}
                    </span>
                  </td>
                  <td className="fw-bold text-success">
                    {Number.isFinite(Number(servicio.precio))
                      ? formatPriceCLP(Number(servicio.precio))
                      : "Precio pendiente"}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 ${
                        servicio.estado === "Activo" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {servicio.estado === "Activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-3 fw-semibold me-2"
                      aria-label={`Editar ${servicio.nombre}`}
                      onClick={() => abrirEditar(servicio)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 fw-bold ${
                        servicio.estado === "Activo"
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                      aria-label={`${servicio.estado === "Activo" ? "Ocultar" : "Activar"} ${servicio.nombre}`}
                      onClick={() => onToggleState(servicio.id)}
                    >
                      {servicio.estado === "Activo" ? "Ocultar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pt-3">
        <div className="small text-muted" aria-live="polite">
          Mostrando {primerResultado}–{ultimoResultado} de {serviciosFiltrados.length}
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="small text-muted">4 filas por página</span>
          <span className="small text-muted mx-1">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            aria-label="Página anterior"
            disabled={paginaActual <= 1}
            onClick={() => setPagina((current) => Math.max(1, current - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            aria-label="Página siguiente"
            disabled={paginaActual >= totalPaginas}
            onClick={() => setPagina((current) => Math.min(totalPaginas, current + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>

      <ModalProducto
        isOpen={modalAbierto}
        servicioEditar={servicioEditar}
        categorias={categoriasValidas}
        onClose={() => setModalAbierto(false)}
        onSave={guardarServicio}
      />
    </div>
  );
}