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
onSave,
}: ModalCrearUsuarioProps): JSX.Element | null {
const [form, setForm] = useState({
    nombre: "",
    fechaNacimiento: "",
    genero: "" as "masculino" | "femenino" | "otro" | "prefiero-no-decirlo" | "",
    email: "",
    password: "",
    rol: "usuario" as "admin" | "usuario" | "nutricionista",
});

const [errors, setErrors] = useState<{ [key: string]: string }>({});

if (!isOpen) return null;

const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};
    const nombreLimpio = form.nombre.trim();
    const emailLimpio = form.email.trim();

    if (!nombreLimpio) {
    nuevosErrores.nombre = "El nombre y apellido son obligatorios.";
    } else if (nombreLimpio.length < 3) {
    nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombreLimpio.length > 60) {
    nuevosErrores.nombre = "El nombre no puede superar los 60 caracteres.";
    }

    if (!form.fechaNacimiento) {
    nuevosErrores.fechaNacimiento = "Selecciona tu fecha de nacimiento.";
    } else {
    const hoy = new Date();
    const fechaNac = new Date(form.fechaNacimiento + "T00:00:00");
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();

    if (
        mesDiferencia < 0 ||
        (mesDiferencia === 0 && hoy.getDate() < fechaNac.getDate())
    ) {
        edad--;
    }

    if (edad < 14) {
        nuevosErrores.fechaNacimiento =
        "Debes tener al menos 14 años para registrarte.";
    } else if (edad > 120) {
        nuevosErrores.fechaNacimiento =
        "Ingresa una fecha de nacimiento válida.";
    }
    }

    if (!form.genero) {
    nuevosErrores.genero = "Selecciona una opción de género.";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailLimpio) {
    nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(emailLimpio)) {
    nuevosErrores.email = "Ingresa un correo válido.";
    } else if (!emailLimpio.toLowerCase().endsWith("@gmail.com")) {
    nuevosErrores.email = "Solo se permiten correos @gmail.com.";
    }

    const passRegex = /^(?=.*[a-z])(?=.*\d).{9,}$/;
    if (!form.password) {
    nuevosErrores.password = "Debes ingresar una contraseña.";
    } else if (!passRegex.test(form.password)) {
    nuevosErrores.password =
        "Debe contener al menos 9 caracteres, incluyendo un número y una letra minúscula.";
    }

    return {
    errores: nuevosErrores,
    isValid: Object.keys(nuevosErrores).length === 0,
    nombreLimpio,
    emailLimpio,
    };
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { errores, isValid, nombreLimpio, emailLimpio } = validarFormulario();

    if (!isValid) {
    setErrors(errores);
    return;
    }

    setErrors({});
    onSave({
    ...form,
    nombre: nombreLimpio,
    email: emailLimpio,
    genero: form.genero as "masculino" | "femenino" | "otro",
    });

    setForm({
    nombre: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    password: "",
    rol: "usuario",
    });
};

return (
    <div
    className="modal fade show d-block"
    tabIndex={-1}
    style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
    <div className="modal-dialog modal-dialog-centered">
        <div
        className="modal-content rounded-4 border border-secondary border-opacity-50 p-4 shadow-lg"
        style={{ backgroundColor: "#1f2937", color: "#f3f4f6" }}
        >
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="fw-bolder mb-0 tracking-tight" style={{ color: "#f59e0b" }}>
            GENERAR NUEVA IDENTIDAD DE RED
            </h6>
            <button
            type="button"
            className="btn-close btn-close-white"
            style={{ fontSize: "0.8rem" }}
            onClick={onClose}
            />
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" noValidate>
            <div>
            <label className="form-label small fw-bold text-white text-uppercase mb-1">
                Nombre Completo
            </label>
            {errors.nombre && (
                <div className="text-danger small fw-semibold mb-1">
                ⚠️ {errors.nombre}
                </div>
            )}
            <input
                type="text"
                className={`form-control bg-dark text-white shadow-none font-monospace ${errors.nombre ? "border-danger" : "border-secondary"}`}
                placeholder="Ej. Juan Pérez"
                value={form.nombre}
                onChange={(e) => {
                setForm({ ...form, nombre: e.target.value });
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: "" }));
                }}
            />
            </div>

            <div className="row g-3">
            <div className="col-6">
                <label className="form-label small fw-bold text-white text-uppercase mb-1">
                D.O.B (Fecha Nac.)
                </label>
                {errors.fechaNacimiento && (
                <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.fechaNacimiento}
                </div>
                )}
                <input
                type="date"
                className={`form-control bg-dark text-white shadow-none font-monospace ${errors.fechaNacimiento ? "border-danger" : "border-secondary"}`}
                value={form.fechaNacimiento}
                onChange={(e) => {
                    setForm({ ...form, fechaNacimiento: e.target.value });
                    if (errors.fechaNacimiento)
                    setErrors((prev) => ({ ...prev, fechaNacimiento: "" }));
                }}
                />
            </div>
            <div className="col-6">
                <label className="form-label small fw-bold text-white text-uppercase mb-1">
                Género
                </label>
                {errors.genero && (
                <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.genero}
                </div>
                )}
                <select
                className={`form-select bg-dark text-white shadow-none font-monospace ${errors.genero ? "border-danger" : "border-secondary"}`}
                value={form.genero}
                onChange={(e) => {
                    setForm({
                    ...form,
                    genero: e.target.value as
                        | "masculino"
                        | "femenino"
                        | "otro"
                        | "prefiero-no-decirlo",
                    });
                    if (errors.genero) setErrors((prev) => ({ ...prev, genero: "" }));
                }}
                >
                <option value="" disabled>
                    Seleccionar...
                </option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
                </select>
            </div>
            </div>

            <div className="row g-3">
            <div className="col-6">
                <label className="form-label small fw-bold text-white text-uppercase mb-1">
                UID (Correo Electrónico)
                </label>
                {errors.email && (
                <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.email}
                </div>
                )}
                <input
                type="email"
                className={`form-control bg-dark text-white shadow-none font-monospace ${errors.email ? "border-danger" : "border-secondary"}`}
                placeholder="usuario@gmail.com"
                value={form.email}
                onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                />
            </div>
            <div className="col-6">
                <label className="form-label small fw-bold text-white text-uppercase mb-1">
                Políticas de Rol
                </label>
                <select
                className="form-select bg-dark text-white border-secondary shadow-none font-monospace"
                value={form.rol}
                onChange={(e) =>
                    setForm({
                    ...form,
                    rol: e.target.value as
                        | "admin"
                        | "usuario"
                        | "nutricionista",
                    })
                }
                >
                <option value="usuario">Paciente / Usuario</option>
                <option value="nutricionista">Staff Clínico</option>
                <option value="admin">Root / SysAdmin</option>
                </select>
            </div>
            </div>

            <div>
            <label className="form-label small fw-bold text-white text-uppercase mb-1">
                Credencial Base (Contraseña)
            </label>
            {errors.password && (
                <div className="text-danger small fw-semibold mb-1">
                ⚠️ {errors.password}
                </div>
            )}
            <input
                type="password"
                className={`form-control bg-dark text-white shadow-none font-monospace ${errors.password ? "border-danger" : "border-secondary"}`}
                placeholder="Min. 9 chars, 1 minúscula, 1 número"
                value={form.password}
                onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
            />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
            <button
                type="button"
                className="btn btn-sm btn-outline-light text-secondary border-secondary"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="btn btn-sm fw-bold"
                style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
            >
                Crear usuario
            </button>
            </div>
        </form>
        </div>
    </div>
    </div>
);
}