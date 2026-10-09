import { useState, type JSX } from "react";
import { Link } from "react-router";

export default function Faq(): JSX.Element {
  const [openFaq, setOpenFaq] = useState<string | null>("faq1");

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <main className="container my-5 py-4 flex-grow-1">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-success mb-3">Preguntas Frecuentes</h1>
            <p className="text-muted lead">
              Resolvemos tus dudas sobre nuestros procesos, evaluaciones y
              tratamientos.
            </p>
          </div>

          <div className="accordion shadow-sm" id="accordionFaq">
            <div className="accordion-item border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-bold text-dark bg-white ${openFaq === "faq1" ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleFaq("faq1")}
                >
                  ¿Cómo funciona la primera evaluación?
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${openFaq === "faq1" ? "show" : ""}`}
              >
                <div className="accordion-body text-muted">
                  En tu primera cita realizamos una anamnesis completa,
                  evaluamos tus hábitos alimentarios, historial clínico y
                  composición corporal. Con esta información, elaboramos tu plan
                  personalizado. Puedes revisar los detalles específicos en
                  nuestra sección de{" "}
                  <Link
                    to="/metodologia"
                    className="text-success fw-semibold text-decoration-none"
                  >
                    Tratamientos y Evaluaciones
                  </Link>
                  .
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-bold text-dark bg-white ${openFaq === "faq2" ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleFaq("faq2")}
                >
                  ¿Atienden por telemedicina si no vivo en Temuco?
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${openFaq === "faq2" ? "show" : ""}`}
              >
                <div className="accordion-body text-muted">
                  Sí. Contamos con consultas 100% online con la misma
                  rigurosidad que una atención presencial. Te enseñamos a tomar
                  tus propias medidas en casa. Conoce los requisitos técnicos y
                  agendamiento en nuestro portal de{" "}
                  <Link
                    to="/telemedicina"
                    className="text-success fw-semibold text-decoration-none"
                  >
                    Telemedicina
                  </Link>
                  .
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-bold text-dark bg-white ${openFaq === "faq3" ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleFaq("faq3")}
                >
                  ¿Tengo que hacer dietas restrictivas?
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${openFaq === "faq3" ? "show" : ""}`}
              >
                <div className="accordion-body text-muted">
                  Bajo ninguna circunstancia. En NutriVida promovemos la
                  reeducación alimentaria. Nuestros planes se adaptan a tus
                  gustos, presupuesto y estilo de vida para asegurar que los
                  resultados sean sostenibles a largo plazo. Puedes descargar
                  recetarios de ejemplo en nuestra sección de{" "}
                  <Link
                    to="/blog"
                    className="text-success fw-semibold text-decoration-none"
                  >
                    Recursos Gratuitos
                  </Link>
                  .
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-bold text-dark bg-white ${openFaq === "faq4" ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleFaq("faq4")}
                >
                  ¿Por qué necesito crear una cuenta en el portal?
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${openFaq === "faq4" ? "show" : ""}`}
              >
                <div className="accordion-body text-muted">
                  Tu cuenta te permite acceder a tu historial de progreso
                  biométrico, descargar tus pautas alimentarias vigentes y subir
                  tus exámenes de laboratorio para que tu nutricionista los
                  revise antes de tu próxima cita.
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5 bg-white p-4 rounded-4 shadow-sm">
            <h4 className="fw-bold text-dark">¿Tienes otra consulta?</h4>
            <p className="text-muted mb-4">
              Nuestro equipo está disponible para ayudarte a dar el primer paso.
            </p>
            <Link to="/#contact" className="btn btn-outline-success">
              Contactar a la clínica
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
