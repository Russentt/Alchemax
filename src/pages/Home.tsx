import { useState, type JSX } from "react";
import { Link } from "react-router";
// Recuerda mantener la importación de tu hoja de estilos global si no la has movido a main.tsx
// import "./index.css"; 

export default function Home(): JSX.Element {
  // Lógica original de tu coworker conservada intacta
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mostrarExito, setMostrarExito] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError(null);

    if (nombre.trim().length < 3) {
      setError("El nombre debe contener 3 caracteres o más.");
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();
    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!regexGmail.test(emailNormalizado)) {
      setError("El correo debe ser @gmail.com");
      return;
    }

    setMostrarExito(true);
    setError(null);
  };

  return (
    <main className="home-wrapper">
      <div className="ambient-glow-health"></div>

      {/* Hero Section Cinético */}
      <section className="hero-section container d-flex flex-column justify-content-center align-items-center text-center">
        <div className="hero-text-mask">
          <h1 className="hero-title display-2 fw-bolder tracking-tight text-dark">
            Tu bienestar comienza
          </h1>
        </div>
        <div className="hero-text-mask">
          <h1 className="hero-title display-2 fw-bolder text-gradient-health">
            desde adentro.
          </h1>
        </div>
        <p className="hero-subtitle mt-4 text-muted fs-5 fade-up-delay mx-auto" style={{ maxWidth: "700px" }}>
          Somos una clínica especializada en nutrición y dietética ubicada en Temuco. Nuestro equipo de 4 nutricionistas te acompañará paso a paso para alcanzar tus metas de salud con planes 100% personalizados.
        </p>
        <div className="mt-5 fade-up-delay-2 d-flex gap-3">
          <a href="#servicios" className="btn-kinetic-health text-decoration-none">
            <span className="btn-text">Ver Especialidades</span>
            <span className="btn-icon">↓</span>
          </a>
          <a href="#contact" className="btn-kinetic-secondary text-decoration-none">
            Agendar Evaluación
          </a>
        </div>
      </section>

      {/* Marquee Clínico */}
      <div className="marquee-container my-5">
        <div className="marquee-track">
          <span className="marquee-text">
            PÉRDIDA DE PESO • CONTROL METABÓLICO • NUTRICIÓN DEPORTIVA • ADULTO MAYOR • SALUD DIGESTIVA • VEGANA Y VEGETARIANA • 
          </span>
          <span className="marquee-text" aria-hidden="true">
            PÉRDIDA DE PESO • CONTROL METABÓLICO • NUTRICIÓN DEPORTIVA • ADULTO MAYOR • SALUD DIGESTIVA • VEGANA Y VEGETARIANA • 
          </span>
        </div>
      </div>

      {/* Bento Grid de Especialidades */}
      <div className="container my-5 py-5" id="servicios">
        <div className="text-center mb-5 fade-up-delay">
          <h2 className="display-6 fw-bold text-dark tracking-tight">Nuestras Especialidades</h2>
          <p className="text-muted">Abordaje clínico basado en evidencia científica.</p>
        </div>
        
        <div className="row g-4 bento-grid">
          <div className="col-lg-8">
            <div className="bento-card card-health-main h-100">
              <div className="bento-content">
                <div className="icon-badge mb-3">⚖️</div>
                <h3 className="fw-bold text-dark">Pérdida de Peso</h3>
                <p className="text-dark opacity-75 fs-5">
                  Planes de déficit calórico sostenibles y saludables, sin dietas extremas. Nos enfocamos en la reeducación alimentaria para lograr resultados duraderos y mejorar tu relación con la comida.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bento-card card-glass-health h-100">
              <div className="bento-content">
                <div className="icon-badge mb-3">🩸</div>
                <h4 className="fw-bold text-dark">Control Metabólico</h4>
                <p className="text-muted small">
                  Tratamiento nutricional para patologías crónicas como diabetes, resistencia a la insulina, hipertensión y dislipidemias, en coordinación con tu médico.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="bento-card card-glass-health h-100">
              <div className="bento-content">
                <div className="icon-badge mb-3">⚡</div>
                <h4 className="fw-bold text-dark">Nutrición Deportiva</h4>
                <p className="text-muted small">
                  Optimiza tu rendimiento, favorece la recuperación muscular y alcanza tus objetivos de composición corporal.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bento-card card-glass-health h-100">
              <div className="bento-content">
                <div className="icon-badge mb-3">🧬</div>
                <h4 className="fw-bold text-dark">Salud Digestiva</h4>
                <p className="text-muted small">
                  Manejo de intestino irritable, gastritis e intolerancias alimentarias, enfocado en reducir la inflamación y restaurar tu bienestar.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bento-card card-glass-health h-100">
              <div className="bento-content">
                <div className="icon-badge mb-3">🌱</div>
                <h4 className="fw-bold text-dark">Vegana / Vegetariana</h4>
                <p className="text-muted small">
                  Transición segura y planificación de dietas basadas en plantas cumpliendo todos tus requerimientos de macro y micronutrientes.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="bento-card card-health-secondary">
              <div className="bento-content d-flex flex-column flex-md-row align-items-center gap-4">
                <div className="flex-grow-1">
                  <h3 className="fw-bold text-dark">Nutrición en el Adulto Mayor</h3>
                  <p className="text-dark opacity-75 mb-0">
                    Planes adaptados para preservar la masa muscular, fortalecer la salud ósea y prevenir el deterioro cognitivo, mejorando la vitalidad y autonomía durante el envejecimiento activo.
                  </p>
                </div>
                <div className="icon-badge-large">👵👴</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre NutriVida (Estilo Glassmorphism Apple) */}
      <div className="container my-5 py-4" id="about">
        <div className="glass-panel p-5 rounded-4 shadow-sm text-center">
          <h3 className="fw-bold text-success mb-4 tracking-tight">Sobre NutriVida</h3>
          <p className="text-dark lead mb-5 mx-auto" style={{ maxWidth: "800px" }}>
            Fundada en 2016 en Temuco, Región de La Araucanía, <strong>NutriVida</strong> nació con el propósito de entregar una atención nutricional empática y basada en evidencia científica.
          </p>
          <div className="row mt-4 g-4 text-start">
            <div className="col-md-4">
              <div className="p-3 border-start border-success border-4">
                <h5 className="text-dark fw-bold">Atención Integral</h5>
                <p className="text-muted small mb-0">4 nutricionistas clínicas capacitadas para abordar diversos requerimientos de salud.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border-start border-success border-4">
                <h5 className="text-dark fw-bold">+60 Pacientes</h5>
                <p className="text-muted small mb-0">Atendemos semanalmente con seguimientos cada 15 o 30 días para asegurar resultados.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border-start border-success border-4">
                <h5 className="text-dark fw-bold">Confianza Médica</h5>
                <p className="text-muted small mb-0">El 70% nos elige por derivación médica o recomendación de pacientes satisfechos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacto y Mapa fusionado con la lógica de estado */}
      <div className="container my-5 pb-5" id="contact">
        <h2 className="text-center fw-bold mb-5 text-dark tracking-tight">Solicita tu Evaluación</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-5">
            <div className="glass-panel p-4 rounded-4 h-100 position-relative">
              <form className="formulario" onSubmit={handleSubmit}>
                
                {/* Alerta de Error adaptada visualmente */}
                {error && (
                  <div className="alert alert-danger py-2 px-3 small border-0 mb-4 rounded-3 shadow-sm" style={{ backgroundColor: 'rgba(220, 53, 69, 0.08)', color: '#dc3545' }} role="alert">
                    ⚠️ {error}
                  </div>
                )}

                <div className="form-group mb-3">
                  <label htmlFor="inputNombre" className="fw-semibold text-dark mb-1 small text-uppercase tracking-tight">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="inputNombre"
                    className="form-control apple-input"
                    placeholder="Ej. María Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="inputEmail" className="fw-semibold text-dark mb-1 small text-uppercase tracking-tight">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="inputEmail"
                    className="form-control apple-input"
                    placeholder="tucorreo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="inputMensaje" className="fw-semibold text-dark mb-1 small text-uppercase tracking-tight">
                    Motivo de consulta
                  </label>
                  <textarea
                    id="inputMensaje"
                    className="form-control apple-input"
                    placeholder="Brevemente, cuéntanos cuál es tu objetivo nutricional..."
                    maxLength={1000}
                    rows={4}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button className="btn btn-success btn-lg fw-bold apple-btn py-3" type="submit">
                    Enviar Solicitud
                  </button>
                </div>

                {/* Tarjeta de Éxito adaptada al Glassmorphism */}
                {mostrarExito && (
                  <div className="glass-panel-small p-4 text-center mt-4 border-success" style={{ borderWidth: '2px', animation: 'revealUp 0.4s ease-out' }}>
                    <div className="text-success fs-1 mb-2">✅</div>
                    <h4 className="fw-bold text-dark tracking-tight">¡Solicitud Recibida!</h4>
                    <p className="text-muted small mb-0">
                      Tu solicitud fue recibida con éxito. Pronto nos pondremos en contacto con usted.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="mapa h-100 rounded-4 overflow-hidden shadow-sm border" style={{ borderColor: 'rgba(0,0,0,0.05)'}}>
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

      {/* CTA Final Cinético */}
      <section className="cta-section py-5 mt-5 position-relative overflow-hidden">
        <div className="cta-bg-gradient"></div>
        <div className="container py-5 position-relative z-index-2">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-5 mb-lg-0 text-center text-lg-start">
              <h2 className="fw-bold display-5 mb-4 text-dark tracking-tight">Tu progreso, ahora en tu bolsillo.</h2>
              <p className="lead mb-4 text-muted">
                Agendar tu evaluación es solo el primer paso. Regístrate en nuestro Portal del Paciente para acceder a herramientas exclusivas.
              </p>
              <Link to="/register" className="btn-kinetic-health text-decoration-none">
                <span className="btn-text">Crear mi cuenta gratis</span>
                <span className="btn-icon">→</span>
              </Link>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="d-flex flex-column gap-4">
                <div className="glass-panel-small p-4 rounded-4 d-flex align-items-start hover-lift">
                  <div className="icon-badge me-3">📊</div>
                  <div>
                    <h5 className="fw-bold text-dark mb-1">Métricas y Evolución Visual</h5>
                    <p className="text-muted small mb-0">Revisa gráficos interactivos con tus cambios de composición corporal a lo largo del tiempo.</p>
                  </div>
                </div>
                <div className="glass-panel-small p-4 rounded-4 d-flex align-items-start hover-lift">
                  <div className="icon-badge me-3">🥗</div>
                  <div>
                    <h5 className="fw-bold text-dark mb-1">Pautas y Recetas Digitales</h5>
                    <p className="text-muted small mb-0">Accede a tus planes de alimentación, listas de supermercado y recetarios desde tu celular.</p>
                  </div>
                </div>
                <div className="glass-panel-small p-4 rounded-4 d-flex align-items-start hover-lift">
                  <div className="icon-badge me-3">📁</div>
                  <div>
                    <h5 className="fw-bold text-dark mb-1">Historial y Exámenes Médicos</h5>
                    <p className="text-muted small mb-0">Sube tus exámenes de laboratorio para que tu nutricionista los evalúe antes de la consulta.</p>
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