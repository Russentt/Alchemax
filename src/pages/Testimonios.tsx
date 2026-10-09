import { Link } from "react-router";

export default function Testimonios() {
  return (
    <main className="container my-5 py-4 flex-grow-1">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success mb-3">
          Historias Reales, Cambios Reales
        </h1>
        <p className="text-muted lead mx-auto" style={{ maxWidth: "700px" }}>
          Más de 60 pacientes semanales confían en nuestro equipo. Conoce cómo
          han transformado su relación con la alimentación y alcanzado sus metas
          de salud.
        </p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div className="col">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="card-body d-flex flex-column">
              <div className="text-warning mb-3 fs-5">⭐⭐⭐⭐⭐</div>
              <p className="card-text text-muted mb-4 flex-grow-1">
                "Después de años intentando dietas de internet que me dejaban
                con hambre, aquí me enseñaron a comer de todo en las porciones
                correctas. Logré revertir mi resistencia a la insulina en 6
                meses."
              </p>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                  style={{ width: "45px", height: "45px" }}
                >
                  RM
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Roberto Muñoz</h6>
                  <small className="text-success fw-semibold">
                    Control Metabólico
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="card-body d-flex flex-column">
              <div className="text-warning mb-3 fs-5">⭐⭐⭐⭐⭐</div>
              <p className="card-text text-muted mb-4 flex-grow-1">
                "La transición al veganismo me asustaba por miedo a perder masa
                muscular. El equipo deportivo me estructuró una pauta impecable.
                Mis niveles de energía mejoraron y mi rendimiento aumentó."
              </p>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                  style={{ width: "45px", height: "45px" }}
                >
                  VS
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Valeria Salazar</h6>
                  <small className="text-success fw-semibold">
                    Nutrición Deportiva Vegana
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="card-body d-flex flex-column">
              <div className="text-warning mb-3 fs-5">⭐⭐⭐⭐⭐</div>
              <p className="card-text text-muted mb-4 flex-grow-1">
                "Me encanta el Portal del Paciente. Tener mis pautas y la lista
                de supermercado en el celular me ha salvado varias veces. La
                atención es empática y súper profesional."
              </p>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                  style={{ width: "45px", height: "45px" }}
                >
                  AL
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Andrea López</h6>
                  <small className="text-success fw-semibold">
                    Pérdida de Peso
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-success text-white rounded-4 shadow-sm p-5 mt-5 text-center">
        <h3 className="fw-bold mb-3">
          ¿Listo para comenzar tu propia historia?
        </h3>
        <p className="mb-4 opacity-75">
          Agenda tu evaluación inicial y conversemos sobre tus objetivos.
        </p>
        <Link
          to="/#contact"
          className="btn btn-light text-success fw-bold px-4 py-2 rounded-pill"
        >
          Quiero empezar hoy
        </Link>
      </div>
    </main>
  );
}
