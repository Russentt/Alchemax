import { useState, type JSX } from "react";
import ModalCategoria from "../admin/ModalCategoria";
import type { Categoria } from "../../types/index";

interface NutricionistaCategoriesTabProps {
  categorias: Categoria[];
  onSave: (
    datos: Omit<Categoria, "id" | "serviciosAsociados">,
    categoriaEditar: Categoria | null,
  ) => boolean;
  onDelete: (categoria: Categoria) => void;
}

export default function NutricionistaCategoriesTab({
  categorias,
  onSave,
  onDelete,
}: NutricionistaCategoriesTabProps): JSX.Element {
  const [busqueda, setBusqueda] = useState("");
  const [modalCrear, setModalCrear] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const guardarCategoria = (
    datos: Omit<Categoria, "id" | "serviciosAsociados">,
  ) => {
    if (!onSave(datos, categoriaEditar)) return;
    setModalCrear(false);
    setCategoriaEditar(null);
  };

  const eliminarCategoria = () => {
    if (!categoriaEliminar) return;
    onDelete(categoriaEliminar);
    setCategoriaEliminar(null);
  };

  const cerrarModal = () => {
    setModalCrear(false);
    setCategoriaEditar(null);
    setCategoriaEliminar(null);
  };

  return (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0"
      style={{ animation: "fadeSlideUp 0.35s var(--ease-spring)" }}
    >
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">
            Taxonomía y Categorías Clínicas
          </h4>
          <p className="text-muted small mb-0">
            Estructura las áreas de especialidad para el filtro del catálogo público.
          </p>
        </div>
        <button
          type="button"
          className="btn-kinetic-health py-2 px-4 border-0 shadow-sm"
          onClick={() => setModalCrear(true)}
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="mb-4" style={{ maxWidth: "420px" }}>
        <input
          type="search"
          className="form-control apple-input"
          placeholder="🔍 Buscar categoría..."
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
        />
      </div>

      <div className="table-responsive rounded-4 bg-white border shadow-sm overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4 py-3 small text-uppercase text-muted">ID</th>
              <th className="py-3 small text-uppercase text-muted">Nombre de Especialidad</th>
              <th className="py-3 small text-uppercase text-muted">Descripción Clínica</th>
              <th className="py-3 text-center small text-uppercase text-muted">Planes Vinculados</th>
              <th className="pe-4 py-3 text-end small text-uppercase text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">
                  No hay categorías que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="ps-4 text-muted small fw-bold">#{categoria.id}</td>
                  <td className="fw-bolder text-dark">{categoria.nombre}</td>
                  <td className="text-muted small">
                    {categoria.descripcion || "Sin descripción"}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold">
                      {categoria.serviciosAsociados ?? 0} planes
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-3 fw-semibold me-2"
                      onClick={() => setCategoriaEditar({ ...categoria })}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                      onClick={() => setCategoriaEliminar(categoria)}
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

      <ModalCategoria
        isOpen={modalCrear || Boolean(categoriaEditar)}
        categoriaEditar={categoriaEditar}
        categoriaEliminar={categoriaEliminar}
        onClose={cerrarModal}
        onSave={guardarCategoria}
        onDeleteConfirm={eliminarCategoria}
      />
    </div>
  );
}