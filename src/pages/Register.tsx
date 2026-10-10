import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { StorageUsuario } from "../services/storageUsuario";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    password: "",
  });

  // Estado para los mensajes de errores
  const [error, setError] = useState<string | null>(null);

  // Manejar el cambio de los input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el vento del submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 1. Validacion de campos completados
    if (
      !formData.nombre.trim() ||
      !formData.fechaNacimiento ||
      !formData.genero ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // 2. Validacion password
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // 3. Guardar usuario en localStorage
    const guardado = StorageUsuario.registrarUsuario({
      nombre: formData.nombre.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      email: formData.email.trim(),
      password: formData.password,
      rol: "usuario",
    });

    // 4. Si el registro no funciona muestra un mensaje de error
    if (!guardado.success) {
      setError(guardado.mensaje);
      return;
    }

    // 5. Redireccion al login
    navigate("/login");
  };

  return (
    <main className="container my-5 py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="bg-white p-5 rounded-4 shadow-sm border-0">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success">Registro de Paciente</h2>
              <p className="text-muted">
                Crea tu cuenta para acceder a nuestro sistema de agendamiento y
                seguimiento nutricional.
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {error}
              </div>
            )}

            <form className="formulario" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="regNombre"
                  className="form-label fw-semibold text-dark"
                >
                  Nombre y apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="regNombre"
                  name="nombre"
                  placeholder="Ej. Camila Andrea Soto"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="regFechaNac"
                    className="form-label fw-semibold text-dark"
                  >
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="regFechaNac"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="regGenero"
                    className="form-label fw-semibold text-dark"
                  >
                    Género
                  </label>
                  <select
                    className="form-select border"
                    id="regGenero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      borderColor: "#e9ecef",
                    }}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero-no-decirlo">
                      Prefiero no decirlo
                    </option>
                  </select>
                </div>
              </div>

              <hr className="text-muted my-4" />

              <div className="mb-3">
                <label
                  htmlFor="regEmail"
                  className="form-label fw-semibold text-dark"
                >
                  Correo electrónico
                </label>
                {/* Note: The original HTML has tucorreo@duocuc.cl placeholder */}
                <input
                  type="email"
                  className="form-control"
                  id="regEmail"
                  name="email"
                  placeholder="tucorreo@duocuc.cl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Fields Here */}
              <div className="mb-3">
                <label
                  htmlFor="regPassword"
                  className="form-label fw-semibold text-dark"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="regPassword"
                  name="password"
                  placeholder="*******"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-success btn-lg fw-bold"
                >
                  Completar Registro
                </button>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-success text-decoration-none fw-semibold"
                  >
                    Inicia sesión aquí
                  </Link>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
