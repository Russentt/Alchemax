import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { StorageUsuario } from "../services/storageUsuario";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Capturar datos de los input[cite: 4]
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim();
    const password = form.get("password") as string;

    // Validar con el localStorage[cite: 4]
    const usuarioValido = StorageUsuario.login(email, password);

    if (!usuarioValido) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    if (usuarioValido.rol === "admin") {
      navigate("/admin");
    } else if (usuarioValido.rol === "nutricionista") {
      navigate("/nutricionista");
    } else {
      navigate("/account");
    }
  };

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

              {error && (
                <div className="alert alert-danger py-2 text-center" role="alert">
                  {error}
                </div>
              )}

              <form className="formulario" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label fw-semibold text-dark">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control apple-input"
                    id="loginEmail"
                    placeholder="tucorreo@email.com"
                    required
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="loginPassword" className="form-label fw-semibold text-dark mb-0">
                      Contraseña
                    </label>
                    <Link to="#" className="text-success text-decoration-none small">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="form-control mt-2 apple-input"
                    id="loginPassword"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>

                <div className="form-check mb-4 mt-3">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label text-muted small" htmlFor="rememberMe">
                    Mantener sesión iniciada
                  </label>
                </div>

                <div className="d-grid mt-2">
                  <button type="submit" className="btn btn-success btn-lg fw-bold apple-btn">
                    Entrar a mi cuenta
                  </button>
                </div>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="text-success text-decoration-none fw-semibold">
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