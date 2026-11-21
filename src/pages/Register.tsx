import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { StorageUsuario } from "../services/storageUsuario";
import {
  AUTH_LIMITS,
  evaluatePasswordStrength,
  getBirthDateBounds,
  getDashboardRouteForRole,
  sanitizeEmail,
  sanitizeName,
  validateBirthDate,
  validateEmail,
  validateGenero,
  validateName,
  validateRegisterPassword,
} from "../utils/authValidation";
import "../index.css"; // Asegura la importación del Core Design System

interface RegisterErrors {
  nombre?: string;
  fechaNacimiento?: string;
  genero?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terminos?: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [birthDateBounds] = useState(() => getBirthDateBounds());
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showTermsSummary, setShowTermsSummary] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Redirige si ya existe una sesión iniciada
  useEffect(() => {
    const sesionActiva = StorageUsuario.getUsuarioSesion();
    if (sesionActiva) {
      navigate(getDashboardRouteForRole(sesionActiva.rol), { replace: true });
    }
  }, [navigate]);

  const passwordStrength = evaluatePasswordStrength(
    formData.password,
    formData.email,
    formData.nombre,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formError) setFormError(null);
    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores: RegisterErrors = {};
    const nombreLimpio = sanitizeName(formData.nombre);
    const emailLimpio = sanitizeEmail(formData.email);

    const nombreError = validateName(formData.nombre);
    if (nombreError) nuevosErrores.nombre = nombreError;

    const fechaError = validateBirthDate(formData.fechaNacimiento);
    if (fechaError) nuevosErrores.fechaNacimiento = fechaError;

    const generoError = validateGenero(formData.genero);
    if (generoError) nuevosErrores.genero = generoError;

    const emailError = validateEmail(formData.email, { requireGmail: true });
    if (emailError) nuevosErrores.email = emailError;

    const passwordError = validateRegisterPassword(
      formData.password,
      emailLimpio,
      nombreLimpio,
    );
    if (passwordError) nuevosErrores.password = passwordError;

    if (!confirmPassword) {
      nuevosErrores.confirmPassword = "Debes repetir tu contraseña.";
    } else if (formData.password !== confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (!aceptaTerminos) {
      nuevosErrores.terminos =
        "Debes aceptar los términos y condiciones para continuar.";
    }

    return {
      errores: nuevosErrores,
      isValid: Object.keys(nuevosErrores).length === 0,
      nombreLimpio,
      emailLimpio,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    const { errores, isValid, nombreLimpio, emailLimpio } = validarFormulario();

    if (!isValid) {
      setErrors(errores);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const guardado = await StorageUsuario.registrarUsuario({
        nombre: nombreLimpio,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        email: emailLimpio,
        password: formData.password,
        rol: "usuario",
      });

      if (!guardado.success) {
        setFormError(guardado.mensaje);
        return;
      }

      // Limpia datos sensibles antes de redirigir
      setFormData((prev) => ({ ...prev, password: "" }));
      setConfirmPassword("");
      navigate("/login", { replace: true, state: { registered: true } });
    } catch {
      setFormError(
        "Ocurrió un problema inesperado al crear tu cuenta. Intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-wrapper d-flex align-items-center min-vh-100 py-4">
      <div className="ambient-glow-health"></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div
          className="row g-0 rounded-5 overflow-hidden shadow-glass bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.05)" }}
        >
          {/* Panel Visual Izquierdo */}
          <div
            className="col-lg-5 d-none d-lg-flex flex-column justify-content-between position-relative p-5 text-white"
            style={{ backgroundColor: "#1a4d2e", overflow: "hidden" }}
          >
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
                  <small className="opacity-75">Tus datos protegidos</small>
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

          {/* Panel del Formulario Derecho */}
          <div className="col-lg-7 p-4 p-md-5 bg-white">
            <div className="max-w-md mx-auto" style={{ maxWidth: "500px" }}>
              <div className="text-start mb-4">
                <h3 className="fw-bold text-dark tracking-tight">
                  Crear cuenta
                </h3>
                <p className="text-muted">
                  Completa tus datos para configurar tu perfil de paciente.
                </p>
              </div>

              {formError && (
                <div
                  className="alert alert-danger py-2 text-center small mb-4"
                  role="alert"
                  aria-live="assertive"
                >
                  {formError}
                </div>
              )}

              <form className="formulario" onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label
                    htmlFor="regNombre"
                    className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                  >
                    Nombre completo
                  </label>
                  {errors.nombre && (
                    <div
                      id="regNombreError"
                      className="text-danger small fw-semibold mb-2"
                      role="alert"
                    >
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
                    autoComplete="name"
                    maxLength={AUTH_LIMITS.MAX_NAME_LENGTH}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.nombre)}
                    aria-describedby={
                      errors.nombre ? "regNombreError" : undefined
                    }
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
                      <div
                        id="regFechaNacError"
                        className="text-danger small fw-semibold mb-2"
                        role="alert"
                      >
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
                      autoComplete="bday"
                      min={birthDateBounds.min}
                      max={birthDateBounds.max}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.fechaNacimiento)}
                      aria-describedby={
                        errors.fechaNacimiento ? "regFechaNacError" : undefined
                      }
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
                      <div
                        id="regGeneroError"
                        className="text-danger small fw-semibold mb-2"
                        role="alert"
                      >
                        ⚠️ {errors.genero}
                      </div>
                    )}
                    <select
                      className={`form-select apple-input ${errors.genero ? "is-invalid" : ""}`}
                      id="regGenero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.genero)}
                      aria-describedby={
                        errors.genero ? "regGeneroError" : undefined
                      }
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
                    <div
                      id="regEmailError"
                      className="text-danger small fw-semibold mb-2"
                      role="alert"
                    >
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
                    autoComplete="email"
                    maxLength={AUTH_LIMITS.MAX_EMAIL_LENGTH}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "regEmailError" : undefined
                    }
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="regPassword"
                      className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                    >
                      Contraseña
                    </label>
                    {errors.password && (
                      <div
                        id="regPasswordError"
                        className="text-danger small fw-semibold mb-2"
                        role="alert"
                      >
                        ⚠️ {errors.password}
                      </div>
                    )}
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control apple-input ${errors.password ? "is-invalid" : ""}`}
                        id="regPassword"
                        name="password"
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        maxLength={AUTH_LIMITS.MAX_PASSWORD_LENGTH}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby="regPasswordHelp"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        aria-pressed={showPassword}
                        disabled={isSubmitting}
                      >
                        {showPassword ? "Ocultar" : "Ver"}
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="regConfirmPassword"
                      className="form-label fw-semibold text-dark small text-uppercase tracking-tight"
                    >
                      Confirmar
                    </label>
                    {errors.confirmPassword && (
                      <div
                        id="regConfirmPasswordError"
                        className="text-danger small fw-semibold mb-2"
                        role="alert"
                      >
                        ⚠️ {errors.confirmPassword}
                      </div>
                    )}
                    <div className="input-group">
                      <input
                        id="regConfirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-control apple-input ${errors.confirmPassword ? "is-invalid" : ""}`}
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              confirmPassword: undefined,
                            }));
                          }
                        }}
                        autoComplete="new-password"
                        maxLength={AUTH_LIMITS.MAX_PASSWORD_LENGTH}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={
                          errors.confirmPassword
                            ? "regConfirmPasswordError"
                            : undefined
                        }
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar confirmación de contraseña"
                            : "Mostrar confirmación de contraseña"
                        }
                        aria-pressed={showConfirmPassword}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? "Ocultar" : "Ver"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Indicador de fortaleza y requisitos de contraseña */}
                <div id="regPasswordHelp" className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">
                      Seguridad de contraseña
                    </small>
                    <small className="fw-semibold text-dark">
                      {passwordStrength.label}
                    </small>
                  </div>
                  <div
                    className="progress mb-2"
                    style={{ height: "6px" }}
                    role="progressbar"
                    aria-valuenow={passwordStrength.score * 25}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Nivel de seguridad de la contraseña"
                  >
                    <div
                      className={`progress-bar ${passwordStrength.barClass}`}
                      style={{ width: `${passwordStrength.score * 25}%` }}
                    />
                  </div>
                  <ul
                    className="list-unstyled row row-cols-1 row-cols-sm-2 g-1 mb-0"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {passwordStrength.requirements.map((req) => (
                      <li
                        key={req.id}
                        className={
                          req.met ? "text-success fw-semibold" : "text-muted"
                        }
                      >
                        {req.met ? "✓" : "•"} {req.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recuadro de Términos y Condiciones */}
                <div className="form-check mb-4 mt-2">
                  <input
                    className={`form-check-input ${errors.terminos ? "is-invalid" : ""}`}
                    type="checkbox"
                    id="terminosCondiciones"
                    checked={aceptaTerminos}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.terminos)}
                    onChange={(e) => {
                      setAceptaTerminos(e.target.checked);
                      if (errors.terminos) {
                        setErrors((prev) => ({ ...prev, terminos: undefined }));
                      }
                    }}
                  />
                  <label
                    className="form-check-label text-muted small tracking-tight ms-1"
                    htmlFor="terminosCondiciones"
                  >
                    He leído y acepto los{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsSummary((prev) => !prev)}
                      className="btn btn-link p-0 align-baseline text-success text-decoration-none fw-semibold small"
                    >
                      términos y condiciones
                    </button>{" "}
                    y la política de privacidad de NutriVida.
                  </label>
                  {errors.terminos && (
                    <div
                      className="text-danger small fw-semibold mt-1"
                      role="alert"
                    >
                      ⚠️ {errors.terminos}
                    </div>
                  )}
                  {showTermsSummary && (
                    <div className="alert alert-light border small mt-2 mb-0 text-muted">
                      Tus datos personales se utilizan exclusivamente para
                      gestionar tu cuenta y atención clínica en NutriVida.
                    </div>
                  )}
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-bold apple-btn py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Creando perfil..."
                      : "Crear perfil médico"}
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
