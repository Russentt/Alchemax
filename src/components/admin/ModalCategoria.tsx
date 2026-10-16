import { useState, useEffect, type JSX } from "react";
import type { Categoria } from "../../types/index";

interface ModalCategoriaProps {
    isOpen: boolean;
    categoriaEditar: Categoria | null;
    categoriaEliminar: Categoria | null;
    onClose: () => void;
    onSave: (datos: Omit<Categoria, "id" | "serviciosAsociados">) => void;
    onDeleteConfirm: () => void;
}

export default function ModalCategoria({
    isOpen,
    categoriaEditar,
    categoriaEliminar,
    onClose,
    onSave,
    onDeleteConfirm,
}: ModalCategoriaProps): JSX.Element | null {
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
    });

    useEffect(() => {
        if (categoriaEditar) {
            setForm({
                nombre: categoriaEditar.nombre,
                descripcion: categoriaEditar.descripcion || "",
            });
        } else {
            setForm({
                nombre: "",
                descripcion: "",
            });
        }
    }, [categoriaEditar, isOpen]);

    // Si el modal no esta activo no muestra nada
    if (!isOpen && !categoriaEliminar) return null;

    if (categoriaEliminar) {
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-4 border-0 p-3 shadow text-center">
                <h6 className="fw-bold text-danger mb-2">Eliminar Categoría</h6>
                <p className="small text-muted mb-3">
                ¿Seguro que deseas eliminar <strong>{categoriaEliminar.nombre}</strong>?
                </p>
                <div className="d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-danger fw-bold" onClick={onDeleteConfirm}>
                    Eliminar
                </button>
                </div>
            </div>
            </div>
        </div>
        );
    }

    // Modal Crear / Editar
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim()) return;
        onSave(form);
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                {categoriaEditar ? "Modificar Categoría" : "Nueva Categoría"}
                </h6>
                <button type="button" className="btn-close small" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nombre de la categoría"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                />

                <textarea
                className="form-control form-control-sm"
                rows={2}
                placeholder="Descripción (opcional)..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />

                <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success fw-bold">
                    {categoriaEditar ? "Guardar" : "Crear"}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
}