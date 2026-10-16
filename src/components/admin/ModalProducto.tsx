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
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                {servicioEditar ? "Modificar Plan" : "Nuevo Plan / Servicio"}
                </h6>
                <button type="button" className="btn-close small" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nombre del Plan"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                />

                <select
                className="form-select form-select-sm"
                value={form.categoriaId}
                onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
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
                    value={form.precio || ""}
                    onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                    min={0}
                    required
                    />
                </div>
                <div className="col-5">
                    <select
                    className="form-select form-select-sm"
                    value={form.tipo}
                    onChange={(e) =>
                        setForm({
                        ...form,
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
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />

                <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success fw-bold">
                    {servicioEditar ? "Guardar" : "Crear"}
                </button>
                </div>
            </form>
            </div>
        </div>
    </div>
    );
}