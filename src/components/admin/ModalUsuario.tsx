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
  const [form, setForm] = useState<Usuario>(() => usuarioEditar ? { ...usuarioEditar } : {
    nombre: "",
    email: "",
    genero: "otro",
    rol: "usuario",
    fechaNacimiento: "",
  });

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
              <p className="mb-1 text-dark">
                ¿Seguro que deseas eliminar a{" "}
                <strong>{usuarioEliminar.nombre}</strong>?
              </p>
              <small className="text-white">
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

  //Modal Editar Usuario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
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
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-white">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-white">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-white">
                  Rol en el Sistema
                </label>
                <select
                  className="form-select"
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
