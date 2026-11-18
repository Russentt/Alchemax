import { useState, type JSX } from "react";
import type { Usuario } from "../../types/index";

interface ModalUsuarioProps {
  usuarioEditar: Usuario | null;
  usuarioEliminar: Usuario | null;
  onClose: () => void;
  onSave: (usuarioActualizado: Usuario) => void;
  onDeleteConfirm: () => void;
}

export default function ModalUsuario({
  ...props
}: ModalUsuarioProps): JSX.Element | null {
  return (
    <ModalUsuarioContent
      key={`${props.usuarioEditar?.id ?? "closed"}-${props.usuarioEliminar?.id ?? ""}`}
      {...props}
    />
  );
}

function ModalUsuarioContent({
  usuarioEditar,
  usuarioEliminar,
  onClose,
  onSave,
  onDeleteConfirm,
}: ModalUsuarioProps): JSX.Element | null {
  const [form, setForm] = useState<Usuario>(() =>
    usuarioEditar
      ? { ...usuarioEditar }
      : {
          nombre: "",
          email: "",
          genero: "otro",
          rol: "usuario",
          fechaNacimiento: "",
        },
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!usuarioEditar && !usuarioEliminar) return null;

  if (usuarioEliminar) {
    return (
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-danger">
                Eliminar Usuario
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body py-3">
              <p className="mb-1">
                ¿Seguro que deseas eliminar a{" "}
                <strong>{usuarioEliminar.nombre}</strong>?
              </p>
              <small className="opacity-75">
                Correo: {usuarioEliminar.email}. Esta acción no se puede
                deshacer.
              </small>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger fw-bold"
                onClick={onDeleteConfirm}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};
    const nombreLimpio = (form.nombre || "").trim();
    const emailLimpio = (form.email || "").trim();

    if (!nombreLimpio) {
      nuevosErrores.nombre = "El nombre y apellido son obligatorios.";
    } else if (nombreLimpio.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombreLimpio.length > 60) {
      nuevosErrores.nombre = "El nombre no puede superar los 60 caracteres.";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailLimpio) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(emailLimpio)) {
      nuevosErrores.email = "Ingresa un correo válido.";
    } else if (!emailLimpio.toLowerCase().endsWith("@gmail.com")) {
      nuevosErrores.email = "Solo se permiten correos @gmail.com.";
    }

    if (!form.rol) {
      nuevosErrores.rol = "Selecciona un rol válido.";
    }

    return {
      errores: nuevosErrores,
      isValid: Object.keys(nuevosErrores).length === 0,
      nombreLimpio,
      emailLimpio,
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

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
    });
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Nombre Completo
                </label>
                {errors.nombre && (
                  <div
                    className="small fw-semibold mb-1 px-2 py-1 rounded"
                    style={{
                      color: "#ff6b6b",
                      backgroundColor: "rgba(220, 53, 69, 0.15)",
                    }}
                  >
                    ⚠️ {errors.nombre}
                  </div>
                )}
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  value={form.nombre}
                  onChange={(e) => {
                    setForm({ ...form, nombre: e.target.value });
                    if (errors.nombre)
                      setErrors((prev) => ({ ...prev, nombre: "" }));
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Correo Electrónico
                </label>
                {errors.email && (
                  <div
                    className="small fw-semibold mb-1 px-2 py-1 rounded"
                    style={{
                      color: "#ff6b6b",
                      backgroundColor: "rgba(220, 53, 69, 0.15)",
                    }}
                  >
                    ⚠️ {errors.email}
                  </div>
                )}
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Rol en el Sistema
                </label>
                {errors.rol && (
                  <div
                    className="small fw-semibold mb-1 px-2 py-1 rounded"
                    style={{
                      color: "#ff6b6b",
                      backgroundColor: "rgba(220, 53, 69, 0.15)",
                    }}
                  >
                    ⚠️ {errors.rol}
                  </div>
                )}
                <select
                  className={`form-select ${errors.rol ? "is-invalid" : ""}`}
                  value={form.rol}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      rol: e.target.value as
                        | "admin"
                        | "usuario"
                        | "nutricionista",
                    });
                    if (errors.rol) setErrors((prev) => ({ ...prev, rol: "" }));
                  }}
                >
                  <option value="usuario">Paciente / Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="nutricionista">Nutricionista</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success fw-bold">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}