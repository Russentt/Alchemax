import { useState, type JSX } from "react";
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
    ...props
}: ModalCategoriaProps): JSX.Element | null {
    return (
        <ModalCategoriaContent
            key={`${props.isOpen}-${props.categoriaEditar?.id ?? "new"}`}
            {...props}
        />
    );
}

function ModalCategoriaContent({
    isOpen,
    categoriaEditar,
    categoriaEliminar,
    onClose,
    onSave,
    onDeleteConfirm,
}: ModalCategoriaProps): JSX.Element | null {
    const [form, setForm] = useState(() => ({
        nombre: categoriaEditar?.nombre ?? "",
        descripcion: categoriaEditar?.descripcion ?? "",
    }));

    if (!isOpen && !categoriaEliminar) return null;

    if (categoriaEliminar) {
        return (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
                <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content rounded-4 border border-secondary border-opacity-50 p-3 shadow-lg" style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
                        <h6 className="fw-bolder text-danger mb-2 tracking-tight">Confirmar Destrucción de categoría</h6>
                        <p className="small text-secondary mb-3">
                            ¿Ejecutar eliminación de la categoría <strong>{categoriaEliminar.nombre}</strong>? Esta acción es irreversible.
                        </p>
                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-sm btn-outline-light text-secondary border-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-sm btn-danger fw-bold" onClick={onDeleteConfirm}>
                                Confirmar eliminación
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim()) return;
        onSave(form);
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border border-secondary border-opacity-50 p-4 shadow-lg" style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h6 className="fw-bolder mb-0 tracking-tight" style={{ color: '#10b981' }}>
                            {categoriaEditar ? "MODIFICAR CATEGORÍA" : "Crear nueva categoría"}
                        </h6>
                        <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.8rem' }} onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Nombre de categoría</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                placeholder="Ej. Medicina Deportiva"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Metadatos / Descripción</label>
                            <textarea
                                className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                rows={2}
                                placeholder="Descripción clínica del área..."
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" className="btn btn-sm btn-outline-light text-secondary border-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-sm fw-bold" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
                                {categoriaEditar ? "Confirmar cambio" : "Crear categoría"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}