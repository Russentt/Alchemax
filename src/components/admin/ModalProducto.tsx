import { useState, type JSX } from "react";
import type { Categoria, Servicio } from "../../types/index";

interface ModalProductoProps {
    isOpen: boolean;
    servicioEditar: Servicio | null;
    categorias: Categoria[];
    onClose: () => void;
    onSave: (datos: {
        nombre: string;
        descripcion: string;
        precio: number;
        tipo: "evaluacion" | "plan" | "control";
        icono: string;
        categoriaId: string;
    }) => void;
}

export default function ModalProducto(props: ModalProductoProps): JSX.Element | null {
    return (
        <ModalProductoContent
            key={`${props.isOpen}-${props.servicioEditar?.id ?? "new"}-${props.categorias[0]?.id ?? ""}`}
            {...props}
        />
    );
}

function ModalProductoContent({
    isOpen,
    servicioEditar,
    categorias,
    onClose,
    onSave,
}: ModalProductoProps): JSX.Element | null {
    const [form, setForm] = useState(() => ({
        nombre: servicioEditar?.nombre ?? "",
        descripcion: servicioEditar?.descripcion ?? "",
        precio: servicioEditar?.precio ?? 0,
        tipo: servicioEditar?.tipo ?? "plan",
        icono: servicioEditar?.icono ?? "🥗",
        categoriaId: servicioEditar?.categoriaId ?? categorias[0]?.id ?? "",
    }));

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border border-secondary border-opacity-50 p-4 shadow-lg" style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h6 className="fw-bolder mb-0 tracking-tight" style={{ color: '#3b82f6' }}>
                            {servicioEditar ? "ACTUALIZAR OBJETO CLÍNICO" : "NUEVO OBJETO CLÍNICO (PLAN/SERVICIO)"}
                        </h6>
                        <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.8rem' }} onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Nombre producto</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                placeholder="Nombre del Plan o Consulta"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Categoría</label>
                            <select
                                className="form-select bg-dark text-white border-secondary shadow-none font-monospace"
                                value={form.categoriaId}
                                onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="row g-3">
                            <div className="col-7">
                                <label className="form-label small fw-bold text-white text-uppercase mb-1">Arancel (CLP)</label>
                                <input
                                    type="number"
                                    className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                    placeholder="Valor numérico"
                                    value={form.precio || ""}
                                    onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                                    min={0}
                                    required
                                />
                            </div>
                            <div className="col-5">
                                <label className="form-label small fw-bold text-white text-uppercase mb-1">Tipo de servicio</label>
                                <select
                                    className="form-select bg-dark text-white border-secondary shadow-none font-monospace"
                                    value={form.tipo}
                                    onChange={(e) =>
                                        setForm({ ...form, tipo: e.target.value as "evaluacion" | "plan" | "control" })
                                    }
                                >
                                    <option value="plan">Plan</option>
                                    <option value="evaluacion">Evaluación</option>
                                    <option value="control">Control</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Especificaciones</label>
                            <textarea
                                className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                rows={2}
                                placeholder="Descripción del alcance del plan..."
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" className="btn btn-sm btn-outline-light text-secondary border-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-sm fw-bold" style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                                Crear producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}