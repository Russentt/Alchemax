import { Link } from "react-router";

export default function Register() {
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

            <form className="formulario">
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
                  placeholder="Ej. Camila Andrea Soto"
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
                  placeholder="tucorreo@duocuc.cl"
                  required
                />
              </div>

              {/* Password Fields Here */}

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
