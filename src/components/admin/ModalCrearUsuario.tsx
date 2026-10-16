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

    const [passwordError, setPasswordError] = useState<string>("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) return;

        // Validación estricta solicitada: Al menos 9 chars, 1 mayúscula, 1 número
        const passRegex = /^(?=.*[A-Z])(?=.*\d).{9,}$/;
        if (!passRegex.test(form.password)) {
            setPasswordError("La credencial debe tener al menos 9 caracteres, incluyendo una letra mayúscula y un número.");
            return;
        }

        onSave(form);
        
        // Reset
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
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border border-secondary border-opacity-50 p-4 shadow-lg" style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h6 className="fw-bolder mb-0 tracking-tight" style={{ color: '#f59e0b' }}>GENERAR NUEVA IDENTIDAD DE RED</h6>
                        <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.8rem' }} onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        {passwordError && (
                            <div className="p-2 rounded bg-danger bg-opacity-25 border border-danger border-opacity-50 text-danger small font-monospace">
                                [SECURITY_POLICY_ERR]: {passwordError}
                            </div>
                        )}

                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                placeholder="Ej. Juan Pérez"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                        </div>

                        <div className="row g-3">
                            <div className="col-6">
                                <label className="form-label small fw-bold text-white text-uppercase mb-1">D.O.B (Fecha Nac.)</label>
                                <input
                                    type="date"
                                    className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                    value={form.fechaNacimiento}
                                    onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-bold text-white text-uppercase mb-1">Género</label>
                                <select
                                    className="form-select bg-dark text-white border-secondary shadow-none font-monospace"
                                    value={form.genero}
                                    onChange={(e) => setForm({ ...form, genero: e.target.value as "masculino" | "femenino" | "otro" })}
                                    required
                                >
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-6">
                                <label className="form-label small fw-bold text-white text-uppercase mb-1">UID (Correo Electrónico)</label>
                                <input
                                    type="email"
                                    className="form-control bg-dark text-white border-secondary shadow-none font-monospace"
                                    placeholder="usuario@dominio.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-bold text-white text-uppercase mb-1">Políticas de Rol</label>
                                <select
                                    className="form-select bg-dark text-white border-secondary shadow-none font-monospace"
                                    value={form.rol}
                                    onChange={(e) => setForm({ ...form, rol: e.target.value as "admin" | "usuario" | "nutricionista" })}
                                    required
                                >
                                    <option value="usuario">Paciente / Usuario</option>
                                    <option value="nutricionista">Staff Clínico</option>
                                    <option value="admin">Root / SysAdmin</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="form-label small fw-bold text-white text-uppercase mb-1">Credencial Base (Contraseña)</label>
                            <input
                                type="password"
                                className={`form-control bg-dark text-white shadow-none font-monospace ${passwordError ? 'border-danger' : 'border-secondary'}`}
                                placeholder="Min. 9 chars, 1 mayúscula, 1 número"
                                value={form.password}
                                onChange={(e) => {
                                    setForm({ ...form, password: e.target.value });
                                    setPasswordError("");
                                }}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" className="btn btn-sm btn-outline-light text-secondary border-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-sm fw-bold" style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}>
                                Crear usuario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}