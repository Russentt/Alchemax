import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { StorageUsuario } from "../services/storageUsuario";

export default function Register() {
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    password: "",
  });

  // Estado para los mensajes de error individuales por cada campo
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Manejar el cambio de los input y limpiar el error de ese campo al escribir
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Manejar el evento del submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevosErrores: { [key: string]: string } = {};

    // 1. Validación de Nombre (obligatorio y longitud mínima/máxima)
    const nombreLimpio = formData.nombre.trim();
    if (!nombreLimpio) {
      nuevosErrores.nombre = "El nombre y apellido son obligatorios.";
    } else if (nombreLimpio.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombreLimpio.length > 60) {
      nuevosErrores.nombre = "El nombre no puede superar los 60 caracteres.";
    }

    // 2. Validación de Fecha de Nacimiento y Edad
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "Selecciona tu fecha de nacimiento.";
    } else {
      const hoy = new Date();
      const fechaNac = new Date(formData.fechaNacimiento + "T00:00:00");
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

    // 3. Validación de Género
    if (!formData.genero) {
      nuevosErrores.genero = "Selecciona una opción de género.";
    }

    // 4. Validación de Correo electrónico
    const emailLimpio = formData.email.trim();
    if (!emailLimpio) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+\$/.test(emailLimpio)) {
      nuevosErrores.email = "Ingresa un formato de correo electrónico válido.";
    }

    // 5. Validación de Contraseña (longitud)
    if (!formData.password.trim()) {
      nuevosErrores.password = "Debes ingresar una contraseña.";
    } else if (formData.password.length < 6) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 6 caracteres.";
    }

    // 6. Validación de Confirmar Contraseña
    if (!confirmPassword.trim()) {
      nuevosErrores.confirmPassword = "Debes repetir tu contraseña.";
    } else if (formData.password !== confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
    }

    // Si hay algún error en cualquier campo, los mostramos y detenemos el envío
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    // 7. Guardar usuario en localStorage
    const guardado = StorageUsuario.registrarUsuario({
      nombre: nombreLimpio,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      email: emailLimpio,
      password: formData.password,
      rol: "usuario",
    });

    // 8. Si el registro falla (ej. el correo ya está registrado), lo mostramos arriba de email
    if (!guardado.success) {
      setErrors({ email: guardado.mensaje });
      return;
    }

    // 9. Redirección al login
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

            <form className="formulario" onSubmit={handleSubmit} noValidate>
              {/* Campo: Nombre y Apellido */}
              <div className="mb-3">
                <label
                  htmlFor="regNombre"
                  className="form-label fw-semibold text-dark"
                >
                  Nombre y apellido
                </label>
                {errors.nombre && (
                  <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.nombre}
                  </div>
                )}
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  id="regNombre"
                  name="nombre"
                  placeholder="Ej. Camila Andrea Soto"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                {/* Campo: Fecha de Nacimiento */}
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="regFechaNac"
                    className="form-label fw-semibold text-dark"
                  >
                    Fecha de nacimiento
                  </label>
                  {errors.fechaNacimiento && (
                    <div className="text-danger small fw-semibold mb-1">
                      ⚠️ {errors.fechaNacimiento}
                    </div>
                  )}
                  <input
                    type="date"
                    className={`form-control ${errors.fechaNacimiento ? "is-invalid" : ""}`}
                    id="regFechaNac"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Campo: Género */}
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="regGenero"
                    className="form-label fw-semibold text-dark"
                  >
                    Género
                  </label>
                  {errors.genero && (
                    <div className="text-danger small fw-semibold mb-1">
                      ⚠️ {errors.genero}
                    </div>
                  )}
                  <select
                    className={`form-select border ${errors.genero ? "is-invalid" : ""}`}
                    id="regGenero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      borderColor: errors.genero ? "#dc3545" : "#e9ecef",
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

              {/* Campo: Correo Electrónico */}
              <div className="mb-3">
                <label
                  htmlFor="regEmail"
                  className="form-label fw-semibold text-dark"
                >
                  Correo electrónico
                </label>
                {errors.email && (
                  <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.email}
                  </div>
                )}
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="regEmail"
                  name="email"
                  placeholder="tucorreo@duocuc.cl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo: Contraseña */}
              <div className="mb-3">
                <label
                  htmlFor="regPassword"
                  className="form-label fw-semibold text-dark"
                >
                  Contraseña
                </label>
                {errors.password && (
                  <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.password}
                  </div>
                )}
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="regPassword"
                  name="password"
                  placeholder="*******"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo: Confirmar Contraseña */}
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold small">
                  Confirmar Contraseña
                </label>
                {errors.confirmPassword && (
                  <div className="text-danger small fw-semibold mb-1">
                    ⚠️ {errors.confirmPassword}
                  </div>
                )}
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
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
