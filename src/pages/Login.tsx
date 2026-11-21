import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { StorageUsuario } from "../services/storageUsuario";
import {
  AUTH_LIMITS,
  getDashboardRouteForRole,
  loginRateLimiter,
  sanitizeEmail,
  validateEmail,
  validateLoginPassword,
} from "../utils/authValidation";

interface LoginLocationState {
  registered?: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState<boolean>(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lockSeconds, setLockSeconds] = useState<number>(() =>
    loginRateLimiter.getRemainingLockSeconds(),
  );
  const [registrationSuccess] = useState<boolean>(() =>
    Boolean((location.state as LoginLocationState | null)?.registered),
  );

  // Redirige automáticamente si ya existe una sesión activa
  useEffect(() => {
    const sesionActiva = StorageUsuario.getUsuarioSesion();
    if (sesionActiva) {
      navigate(getDashboardRouteForRole(sesionActiva.rol), { replace: true });
    }
  }, [navigate]);

  // Limpia el estado de navegación tras mostrar el aviso de registro exitoso
  useEffect(() => {
    if ((location.state as LoginLocationState | null)?.registered) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // Temporizador para el bloqueo temporal ante múltiples intentos fallidos
  useEffect(() => {
    if (lockSeconds <= 0) return;

    const timer = window.setInterval(() => {
      const remaining = loginRateLimiter.getRemainingLockSeconds();
      setLockSeconds(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [lockSeconds]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    const remainingLock = loginRateLimiter.getRemainingLockSeconds();
    if (remainingLock > 0) {
      setLockSeconds(remainingLock);
      setError(
        `Demasiados intentos fallidos. Intenta nuevamente en ${remainingLock} segundos.`,
      );
      return;
    }

    const emailError = validateEmail(email);
    const passwordError = validateLoginPassword(password);

    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const cleanEmail = sanitizeEmail(email);
      const usuarioValido = await StorageUsuario.login(
        cleanEmail,
        password,
        rememberMe,
      );

      if (!usuarioValido) {
        const result = loginRateLimiter.recordFailedAttempt();
        // Limpia el campo de contraseña tras un fallo de autenticación
        setPassword("");

        if (result.locked) {
          setLockSeconds(result.lockSeconds);
          setError(
            `Demasiados intentos fallidos. Por seguridad, espera ${result.lockSeconds} segundos antes de volver a intentar.`,
          );
        } else {
          // Mensaje genérico para evitar enumeración de cuentas
          setError("Correo o contraseña incorrectos.");
        }
        return;
      }

      loginRateLimiter.resetAttempts();
      setPassword("");
      navigate(getDashboardRouteForRole(usuarioValido.rol), { replace: true });
    } catch {
      setPassword("");
      setError("No se pudo iniciar sesión en este momento. Intenta más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = lockSeconds > 0;

  return (
    <main className="login-wrapper">
      <div className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="glass-card p-5 rounded-4 border-0">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-success">Iniciar Sesión</h2>
                <p className="text-muted">Accede a tu Portal del Paciente.</p>
              </div>

              {registrationSuccess && !error && (
                <div
                  className="alert alert-success py-2 text-center small"
                  role="status"
                >
                  Cuenta creada correctamente. Ya puedes iniciar sesión.
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger py-2 text-center small"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}

              {isLocked && (
                <div
                  className="alert alert-warning py-2 text-center small"
                  role="status"
                  aria-live="polite"
                >
                  Inicio de sesión temporalmente pausado ({lockSeconds}s).
                </div>
              )}

              <form className="formulario" onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label
                    htmlFor="loginEmail"
                    className="form-label fw-semibold text-dark"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control apple-input ${fieldErrors.email ? "is-invalid" : ""}`}
                    id="loginEmail"
                    placeholder="tucorreo@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                      if (error) setError(null);
                    }}
                    autoComplete="email"
                    maxLength={AUTH_LIMITS.MAX_EMAIL_LENGTH}
                    disabled={isSubmitting || isLocked}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "loginEmailError" : undefined
                    }
                    required
                  />
                  {fieldErrors.email && (
                    <div
                      id="loginEmailError"
                      className="invalid-feedback d-block"
                      role="alert"
                    >
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="loginPassword"
                      className="form-label fw-semibold text-dark mb-0"
                    >
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRecoveryInfo((prev) => !prev)}
                      className="btn btn-link p-0 text-success text-decoration-none small"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="input-group mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-control apple-input ${fieldErrors.password ? "is-invalid" : ""}`}
                      id="loginPassword"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                        if (error) setError(null);
                      }}
                      autoComplete="current-password"
                      maxLength={AUTH_LIMITS.MAX_PASSWORD_LENGTH}
                      disabled={isSubmitting || isLocked}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={
                        fieldErrors.password ? "loginPasswordError" : undefined
                      }
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-pressed={showPassword}
                      disabled={isSubmitting || isLocked}
                    >
                      {showPassword ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div
                      id="loginPasswordError"
                      className="invalid-feedback d-block"
                      role="alert"
                    >
                      {fieldErrors.password}
                    </div>
                  )}
                </div>

                {showRecoveryInfo && (
                  <div
                    className="alert alert-info py-2 px-3 small mb-3"
                    role="status"
                  >
                    Por seguridad, la recuperación de contraseña se gestiona
                    directamente con soporte clínico de NutriVida.
                  </div>
                )}

                <div className="form-check mb-4 mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isSubmitting || isLocked}
                  />
                  <label
                    className="form-check-label text-muted small"
                    htmlFor="rememberMe"
                  >
                    Mantener sesión iniciada (solo en dispositivos de confianza)
                  </label>
                </div>

                <div className="d-grid mt-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-bold apple-btn"
                    disabled={isSubmitting || isLocked}
                  >
                    {isSubmitting
                      ? "Verificando..."
                      : isLocked
                        ? `Espera ${lockSeconds}s`
                        : "Entrar a mi cuenta"}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      to="/register"
                      className="text-success text-decoration-none fw-semibold"
                    >
                      Regístrate aquí
                    </Link>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
