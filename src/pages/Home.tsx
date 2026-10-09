import { type JSX } from "react";
import { Link } from "react-router";

export default function Home(): JSX.Element {
  return (
    <main>
      <section className="container text-center my-5 py-4">
        <h1 className="display-5 fw-bold text-dark">
          Tu bienestar comienza desde adentro
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
          Somos una clínica especializada en nutrición y dietética ubicada en
          Temuco. Nuestro equipo de 4 nutricionistas te acompañará paso a paso
          para alcanzar tus metas de salud con planes de alimentación 100%
          personalizados.
        </p>
      </section>

      <div className="container my-5" id="servicios">
        <h2 className="text-center fw-bold mb-5 text-success">
          Nuestras Especialidades
        </h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col">
            <div className="card h-100 shadow-sm border-0 service-card">
              <div className="card-body text-center p-4">
                <h5 className="card-title fw-bold text-dark">
                  Pérdida de Peso
                </h5>
                <p className="card-text text-muted mt-3">
                  Planes de déficit calórico sostenibles y saludables, sin
                  dietas extremas. Nos enfocamos en la reeducación alimentaria
                  para lograr resultados duraderos y mejorar tu relación con la
                  comida.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm border-0 service-card">
              <div className="card-body text-center p-4">
                <h5 className="card-title fw-bold text-dark">
                  Control Metabólico
                </h5>
                <p className="card-text text-muted mt-3">
                  Tratamiento nutricional para patologías crónicas como
                  diabetes, resistencia a la insulina, hipertensión,
                  dislipidemias y síndrome metabólico, siempre en coordinación
                  con tu médico tratante.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm border-0 service-card">
              <div className="card-body text-center p-4">
                <h5 className="card-title fw-bold text-dark">
                  Nutrición Deportiva
                </h5>
                <p className="card-text text-muted mt-3">
                  Optimiza tu rendimiento deportivo, favorece la recuperación
                  muscular y alcanza tus objetivos de composición corporal, ya
                  seas un atleta de alto rendimiento o entusiasta del fitness.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm border-0 service-card">
              <div className="card-body text-center p-4">
                <h5 className="card-title fw-bold text-dark">
                  Alimentación Vegana / Vegetariana
                </h5>
                <p className="card-text text-muted mt-3">
                  Transición segura y planificación de dietas basadas en
                  plantas. Aseguramos el cumplimiento de todos tus
                  requerimientos de macro y micronutrientes para una vida plena
                  y saludable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 py-4">
        <div className="caja-item bg-light p-5 rounded-4 shadow-sm" id="about">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-success">Sobre NutriVida</h3>
          </div>
          <div className="text-dark text-center lead mb-5">
            Fundada en 2016 en Temuco, Región de La Araucanía,{" "}
            <strong>NutriVida</strong> nació con el propósito de entregar una
            atención nutricional empática y basada en evidencia científica.
          </div>
          <div className="row text-center mt-4 g-4">
            <div className="col-md-4">
              <h4 className="text-success fw-bold">Atención Integral</h4>
              <p className="text-muted">
                Nuestro equipo está formado por 4 nutricionistas clínicas
                capacitadas para abordar diversos requerimientos de salud y
                bienestar.
              </p>
            </div>
            <div className="col-md-4">
              <h4 className="text-success fw-bold">+60 Pacientes</h4>
              <p className="text-muted">
                Atendemos semanalmente a más de 60 pacientes, realizando
                seguimientos cada 15 o 30 días para asegurar el apego al
                tratamiento.
              </p>
            </div>
            <div className="col-md-4">
              <h4 className="text-success fw-bold">Confianza Médica</h4>
              <p className="text-muted">
                El 70% de nuestros pacientes nos elige por derivación directa de
                su médico o recomendación de otros pacientes satisfechos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 pb-5" id="contact">
        <h2 className="text-center fw-bold mb-4 text-success">
          Solicita tu Hora de Evaluación
        </h2>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6">
            <div className="contenedor-formulario bg-white p-4 rounded-4 shadow-sm">
              <form className="formulario">
                <div className="form-group mb-3">
                  <label htmlFor="inputNombre" className="fw-semibold">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="inputNombre"
                    className="form-control"
                    placeholder="Ej. María Pérez"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="inputEmail" className="className-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    placeholder="tucorreo@email.com"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="inputMensaje" className="fw-semibold">
                    Motivo de consulta
                  </label>
                  <textarea
                    id="inputMensaje"
                    className="form-control"
                    placeholder="Brevemente, cuéntanos cuál es tu objetivo nutricional..."
                    maxLength={1000}
                    rows={5}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button className="btn btn-success btn-lg" type="submit">
                    Enviar Solicitud de Agendamiento
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mapa h-100 rounded-4 overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100067.75019011409!2d-72.68413840742133!3d-38.73461413444855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3e5a59379fd%3A0xc6226ea5d63f2d24!2sTemuco%2C%20Araucania!5e0!3m2!1sen!2scl!4v1700000000000!5m2!1sen!2scl"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="bg-success text-white py-5 mt-5 shadow-lg">
        <div className="container-fluid py-4 px-4 px-md-5">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0 text-center text-lg-start">
              <h2 className="fw-bold display-6 mb-3">
                Tu progreso, ahora en tu bolsillo
              </h2>
              <p className="lead mb-4" style={{ opacity: 0.9 }}>
                Agendar tu evaluación es solo el primer paso. Regístrate en
                nuestro <strong>Portal del Paciente</strong> para acceder a
                herramientas exclusivas que te mantendrán motivado y conectado
                con tu nutricionista en todo momento.
              </p>
              <Link
                to="/register"
                className="btn btn-light text-success btn-lg fw-bold px-4 rounded-pill shadow-sm"
              >
                Crear mi cuenta gratis
              </Link>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start">
                  <div
                    className="bg-white text-success rounded-circle p-3 me-3 shadow-sm d-flex justify-content-center align-items-center"
                    style={{ width: "60px", height: "60px", flexShrink: 0 }}
                  >
                    <span className="fs-4">📊</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      Métricas y Evolución Visual
                    </h5>
                    <p className="mb-0" style={{ opacity: 0.85 }}>
                      Revisa gráficos interactivos con tus cambios de
                      composición corporal: porcentaje de grasa, masa muscular y
                      peso a lo largo del tiempo.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div
                    className="bg-white text-success rounded-circle p-3 me-3 shadow-sm d-flex justify-content-center align-items-center"
                    style={{ width: "60px", height: "60px", flexShrink: 0 }}
                  >
                    <span className="fs-4">🥗</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Pautas y Recetas Digitales</h5>
                    <p className="mb-0" style={{ opacity: 0.85 }}>
                      No más papeles que se pierden. Accede a tus planes de
                      alimentación, listas de supermercado y recetarios desde tu
                      celular cuando vayas de compras.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div
                    className="bg-white text-success rounded-circle p-3 me-3 shadow-sm d-flex justify-content-center align-items-center"
                    style={{ width: "60px", height: "60px", flexShrink: 0 }}
                  >
                    <span className="fs-4">📁</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      Historial y Exámenes Médicos
                    </h5>
                    <p className="mb-0" style={{ opacity: 0.85 }}>
                      Sube tus exámenes de laboratorio (perfil lipídico,
                      insulina, etc.) para que tu nutricionista los evalúe antes
                      de la consulta de seguimiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
