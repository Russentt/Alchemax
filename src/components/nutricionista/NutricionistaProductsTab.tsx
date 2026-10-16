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
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditar, setServicioEditar] = useState<Servicio | null>(null);

  const serviciosFiltrados = servicios.filter((servicio) => {
    const coincideTexto = servicio.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaActiva === "todas" ||
      String(servicio.categoriaId) === String(categoriaActiva);
    return coincideTexto && coincideCategoria;
  });

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
      className="glass-panel p-4 p-md-5 rounded-5 border-0"
      style={{ animation: "fadeSlideUp 0.35s var(--ease-spring)" }}
    >
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">
            Catálogo de Planes y Prestaciones
          </h4>
          <p className="text-muted small mb-0">
            Administra los servicios clínicos disponibles para los pacientes.
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

      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <input
            type="search"
            className="form-control apple-input"
            placeholder="🔍 Filtrar planes por nombre..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>
        <div className="col-md-5">
          <select
            className="form-select apple-input fw-semibold"
            value={categoriaActiva}
            onChange={(event) => setCategoriaActiva(event.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
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
                  No se encontraron planes con los filtros aplicados.
                </td>
              </tr>
            ) : (
              serviciosFiltrados.map((servicio) => (
                <tr key={servicio.id}>
                  <td className="ps-4 text-muted small fw-bold">#{servicio.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-4">{servicio.icono}</span>
                      <div>
                        <div className="fw-bolder text-dark">{servicio.nombre}</div>
                        <small className="text-muted">{servicio.tipo}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border rounded-pill px-3">
                      {servicio.categoriaNombre || "General"}
                    </span>
                  </td>
                  <td className="fw-bold text-success">
                    {formatPriceCLP(servicio.precio)}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 ${
                        servicio.estado === "Activo" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {servicio.estado}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-3 fw-semibold me-2"
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

      <ModalProducto
        isOpen={modalAbierto}
        servicioEditar={servicioEditar}
        categorias={categorias}
        onClose={() => setModalAbierto(false)}
        onSave={guardarServicio}
      />
    </div>
  );
}