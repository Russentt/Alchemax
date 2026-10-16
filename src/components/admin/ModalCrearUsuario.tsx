import { useState, type JSX } from "react";
import type { Usuario } from "../../types/index";

interface ModalCrearUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nuevoUsuario: Usuario) => void;
}

export default function ModalCrearUsuario({
    isOpen,
    onClose,
    onSave
}: ModalCrearUsuarioProps): JSX.Element | null {
    const [form, setForm] = useState({
        nombre: "",
        fechaNacimiento: "",
        genero: "otro" as "masculino" | "femenino" | "otro",
        email: "",
        password: "",
        rol: "usuario" as "admin" | "usuario" | "nutricionista",
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) return;

    onSave(form);
    // Reiniciar los campos tras guardar
    setForm({
        nombre: "",
        fechaNacimiento: "",
        genero: "otro",
        email: "",
        password: "",
        rol: "usuario",
        });
    };

    return (
        <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Nuevo Paciente / Usuario</h6>
                <button type="button" className="btn-close small" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                <div>
                <label className="form-label small fw-semibold text-muted mb-1">
                    Nombre Completo
                </label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. Juan Pérez"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                />
                </div>

                <div className="row g-2">
                <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">
                    Fecha de Nacimiento
                    </label>
                    <input
                    type="date"
                    className="form-control form-control-sm"
                    value={form.fechaNacimiento}
                    onChange={(e) =>
                        setForm({ ...form, fechaNacimiento: e.target.value })
                    }
                    required
                    />
                </div>

                <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">
                    Género
                    </label>
                    <select
                    className="form-select form-select-sm"
                    value={form.genero}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        genero: e.target.value as "masculino" | "femenino" | "otro",
                        })
                    }
                    required
                    >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    </select>
                </div>
                </div>

                <div className="row g-2">
                <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">
                    Correo Electrónico
                    </label>
                    <input
                    type="email"
                    className="form-control form-control-sm"
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    />
                </div>

                <div className="col-6">
                    <label className="form-label small fw-semibold text-muted mb-1">
                    Rol en el Sistema
                    </label>
                    <select
                    className="form-select form-select-sm"
                    value={form.rol}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        rol: e.target.value as "admin" | "usuario" | "nutricionista",
                        })
                    }
                    required
                    >
                    <option value="usuario">Paciente / Usuario</option>
                    <option value="admin">Administrador</option>
                    <option value="nutricionista">Nutricionista</option>
                    </select>
                </div>
                </div>

                <div>
                <label className="form-label small fw-semibold text-muted mb-1">
                    Contraseña
                </label>
                <input
                    type="password"
                    className="form-control form-control-sm"
                    placeholder="Contraseña segura"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success fw-bold">
                    Crear Usuario
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
}