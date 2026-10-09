import { Link } from "react-router";

export default function Login() {
  return (
    <main className="container my-auto py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="bg-white p-5 rounded-4 shadow-sm border-0">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success">Iniciar Sesión</h2>
              <p className="text-muted">Accede a tu Portal del Paciente.</p>
            </div>

            <form className="formulario">
              <div className="mb-3">
                <label
                  htmlFor="loginEmail"
                  className="form-label fw-semibold text-dark"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  placeholder="tucorreo@email.com"
                  required
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label
                    htmlFor="loginPassword"
                    className="form-label fw-semibold text-dark mb-0"
                  >
                    Contraseña
                  </label>
                  <Link
                    to="#"
                    className="text-success text-decoration-none small"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  type="password"
                  className="form-control mt-2"
                  id="loginPassword"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                />
                <label
                  className="form-check-label text-muted small"
                  htmlFor="rememberMe"
                >
                  Mantener sesión iniciada
                </label>
              </div>

              <div className="d-grid mt-2">
                <button
                  type="submit"
                  className="btn btn-success btn-lg fw-bold"
                >
                  Entrar a mi cuenta
                </button>
              </div>
              <div id="mensajeLogin"></div>

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
    </main>
  );
}
