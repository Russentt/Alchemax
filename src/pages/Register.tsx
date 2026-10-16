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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevosErrores: { [key: string]: string } = {};

    const nombreLimpio = formData.nombre.trim();
    if (!nombreLimpio) {
      nuevosErrores.nombre = "El nombre y apellido son obligatorios.";
    } else if (nombreLimpio.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombreLimpio.length > 60) {
      nuevosErrores.nombre = "El nombre no puede superar los 60 caracteres.";
    }

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

    if (!formData.genero) {
      nuevosErrores.genero = "Selecciona una opción de género.";
    }

    const emailLimpio = formData.email.trim();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailLimpio) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(emailLimpio)) {
      nuevosErrores.email = "Ingresa un correo válido.";
    } else if (!emailLimpio.toLowerCase().endsWith("@gmail.com")) {
      nuevosErrores.email = "Solo se permiten correos @gmail.com.";
    }

    if (!formData.password.trim()) {
      nuevosErrores.password = "Debes ingresar una contraseña.";
    } else if (formData.password.length < 9) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 9 caracteres.";
    }

    if (!confirmPassword.trim()) {
      nuevosErrores.confirmPassword = "Debes repetir tu contraseña.";
    } else if (formData.password !== confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    const guardado = StorageUsuario.registrarUsuario({
      nombre: nombreLimpio,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      email: emailLimpio,
      password: formData.password,
      rol: "usuario",
    });

    if (!guardado.success) {
      setErrors({ email: guardado.mensaje });
      return;
    }

    navigate("/login");
  };

  return (
    <main className="app-wrapper d-flex align-items-center min-vh-100 py-4">
      <div className="ambient-glow-health"></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div
          className="row g-0 rounded-5 overflow-hidden shadow-glass bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.05)" }}
        >
          {/* Panel Visual Izquierdo (Avant-garde / Hoverstat inspired) */}
          <div
            className="col-lg-5 d-none d-lg-flex flex-column justify-content-between position-relative p-5 text-white"
            style={{ backgroundColor: "#1a4d2e", overflow: "hidden" }}
          >
            {/* Elemento cinético de fondo */}
            <div
              className="position-absolute"
              style={{
                top: "-10%",
                right: "-20%",
                width: "400px",
                height: "400px",
                background:
                  "radial-gradient(circle, rgba(46,204,113,0.3) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            ></div>

            <div className="position-relative z-index-2">
              <Link
                to="/"
                className="text-white text-decoration-none fw-bolder fs-4 tracking-tight"
              >
                NutriVida.
              </Link>
            </div>

            <div className="position-relative z-index-2 my-5">
              <h2
                className="display-4 fw-bolder tracking-tight mb-4"
                style={{ lineHeight: 1.1 }}
              >
                Diseña tu <br />
                <span style={{ color: "#2ecc71" }}>mejor versión.</span>
              </h2>
              <p className="fs-5 opacity-75 fw-light">
                Únete a cientos de pacientes que ya están transformando sus
                hábitos con ciencia y empatía.
              </p>
            </div>

            {/* Micro-componentes: Badges de confianza tipo Bento flotantes */}
            <div className="position-relative z-index-2 d-flex flex-column gap-3">
              <div
                className="glass-panel-small p-3 rounded-4 d-flex align-items-center gap-3 w-75 hover-lift"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              >
                <div
                  className="icon-badge text-success"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  🔒
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Privacidad Clínica</h6>
                  <small className="opacity-75">Tus datos encriptados</small>
                </div>
              </div>
              <div
                className="glass-panel-small p-3 rounded-4 d-flex align-items-center gap-3 w-75 hover-lift ms-4"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              >
                <div
                  className="icon-badge text-success"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  📱
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Portal Interactivo</h6>
                  <small className="opacity-75">Pautas en tu bolsillo</small>
                </div>
              </div>
            </div>
          </div>

          {/* Panel del Formulario Derecho (Apple Minimalist) */}
          <div className="col-lg-7 p-4 p-md-5 bg-white">
            <div className="max-w-md mx-auto" style={{ maxWidth: "500px" }}>
              <div className="text-start mb-5">
                <h3 className="fw-bold text-dark tracking-tight">
                  Crear cuenta
                </h3>
                <p className="text-muted">
                  Completa tus datos para configurar tu perfil de paciente.
                </p>
              </div>

              <form className="formulario" onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label
                    htmlFor="regNombre"
                    className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                  >
                    Nombre completo
                  </label>
                  {errors.nombre && (
                    <div className="text-danger small fw-semibold mb-2">
                      ⚠️ {errors.nombre}
                    </div>
                  )}
                  <input
                    type="text"
                    className={`form-control apple-input ${errors.nombre ? "is-invalid" : ""}`}
                    id="regNombre"
                    name="nombre"
                    placeholder="Ej. Camila Andrea Soto"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label
                      htmlFor="regFechaNac"
                      className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                    >
                      Nacimiento
                    </label>
                    {errors.fechaNacimiento && (
                      <div className="text-danger small fw-semibold mb-2">
                        ⚠️ {errors.fechaNacimiento}
                      </div>
                    )}
                    <input
                      type="date"
                      className={`form-control apple-input ${errors.fechaNacimiento ? "is-invalid" : ""}`}
                      id="regFechaNac"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="regGenero"
                      className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                    >
                      Género
                    </label>
                    {errors.genero && (
                      <div className="text-danger small fw-semibold mb-2">
                        ⚠️ {errors.genero}
                      </div>
                    )}
                    <select
                      className={`form-select apple-input ${errors.genero ? "is-invalid" : ""}`}
                      id="regGenero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      required
                      style={{
                        borderColor: errors.genero ? "#dc3545" : undefined,
                      }}
                    >
                      <option value="" disabled>
                        Seleccionar...
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

                <div className="mb-4">
                  <label
                    htmlFor="regEmail"
                    className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                  >
                    Correo electrónico
                  </label>
                  {errors.email && (
                    <div className="text-danger small fw-semibold mb-2">
                      ⚠️ {errors.email}
                    </div>
                  )}
                  <input
                    type="email"
                    className={`form-control apple-input ${errors.email ? "is-invalid" : ""}`}
                    id="regEmail"
                    name="email"
                    placeholder="tucorreo@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label
                      htmlFor="regPassword"
                      className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                    >
                      Contraseña
                    </label>
                    {errors.password && (
                      <div className="text-danger small fw-semibold mb-2">
                        ⚠️ {errors.password}
                      </div>
                    )}
                    <input
                      type="password"
                      className={`form-control apple-input ${errors.password ? "is-invalid" : ""}`}
                      id="regPassword"
                      name="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small text-uppercase tracking-tight">
                      Confirmar
                    </label>
                    {errors.confirmPassword && (
                      <div className="text-danger small fw-semibold mb-2">
                        ⚠️ {errors.confirmPassword}
                      </div>
                    )}
                    <input
                      type="password"
                      name="confirmPassword"
                      className={`form-control apple-input ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Repetir contraseña"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid mt-5">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-bold apple-btn py-3"
                  >
                    Crear perfil médico
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted small">
                    ¿Ya tienes un perfil?{" "}
                    <Link
                      to="/login"
                      className="text-success text-decoration-none fw-bold hover-lift d-inline-block"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
