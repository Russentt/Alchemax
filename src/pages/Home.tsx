import { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import { StorageServicios } from "../services/storageProductos";
import { TiendaService } from "../services/tiendaService";
import { StorageUsuario } from "../services/storageUsuario";
import type { Servicio } from "../types/index";
import { formatPriceCLP } from "../utils/formatPriceCLP";

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  // Estados del formulario (Coworker)
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mostrarExito, setMostrarExito] = useState(false);

  // Estados de la Vitrina del Catálogo
  const [serviciosPreview] = useState<Servicio[]>(() => {
    const srvsGuardados = StorageServicios.getServicios() || [];
    return srvsGuardados
      .filter((s) => !s.estado || s.estado === "Activo")
      .slice(0, 3);
  });
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" } | null>(null);

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

    // Activamos el estado de éxito
    setMostrarExito(true);
    setError(null);
  };

  // Función para reiniciar el formulario y permitir enviar otra consulta
  const handleResetForm = () => {
    setMostrarExito(false);
    setNombre("");
    setEmail("");
    setMensaje("");
  };

  const handleAddToCart = (servicio: Servicio) => {
    const sesionActual = StorageUsuario.getUsuarioSesion();

    if (!sesionActual) {
      setNotification({ message: "Inicia sesión para reservar un plan.", type: "warning" });
      setTimeout(() => {
        setNotification(null);
        navigate("/login");
      }, 2500);
      return;
    }

    TiendaService.agregarAlCarrito(servicio);
    setNotification({ message: `¡"${servicio.nombre}" añadido al carrito!`, type: "success" });
    
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <main className="home-wrapper">
      <div className="ambient-glow-health"></div>

      {/* Sistema de Notificaciones Flotante (Vitrina) */}
      {notification && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-4" style={{ zIndex: 1100, marginTop: "80px", animation: "fadeSlideUp 0.4s var(--ease-spring)" }}>
          <div className="glass-panel-small px-4 py-3 rounded-pill d-flex align-items-center gap-3 shadow-glass">
            <span className="fs-5">{notification.type === "success" ? "✅" : "⚠️"}</span>
            <span className="fw-semibold text-dark mb-0 small">{notification.message}</span>
            {notification.type === "success" && (
              <Link to="/carrito" className="btn-kinetic-health text-decoration-none py-1 px-3 ms-2" style={{ fontSize: '0.8rem' }}>
                Ir al pago
              </Link>
            )}
            <button type="button" className="btn-close ms-2" onClick={() => setNotification(null)}></button>
          </div>
        </div>
      )}

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
          <a href="#vitrina" className="btn-kinetic-health text-decoration-none">
            <span className="btn-text">Ver Planes</span>
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

      {/* VITRINA DE CATÁLOGO EXPRESS */}
      <div className="container my-5 py-5" id="vitrina">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 fade-up-delay border-bottom pb-4" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <div>
            <h2 className="display-6 fw-bold text-dark tracking-tight mb-2">Planes Destacados</h2>
            <p className="text-muted mb-0">Inicia tu transformación hoy mismo.</p>
          </div>
          <Link to="/metodologia#catalogo" className="btn-kinetic-secondary text-decoration-none mt-4 mt-md-0 shadow-sm">
            Explorar catálogo completo →
          </Link>
        </div>

        <div className="row g-4">
          {serviciosPreview.length > 0 ? (
            serviciosPreview.map((servicio) => (
              <div key={servicio.id} className="col-lg-4 col-md-6">
                <div className="glass-panel-small h-100 rounded-5 hover-lift p-4 d-flex flex-column position-relative overflow-hidden">
                  <div className="position-absolute" style={{ top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.05, filter: 'grayscale(100%)' }}>
                    {servicio.icono}
                  </div>
                  <div className="fs-1 mb-3 position-relative z-index-2">{servicio.icono}</div>
                  <span className="badge bg-dark text-white border-0 align-self-start mb-3 rounded-pill text-uppercase px-3 py-1 tracking-tight" style={{ fontSize: "0.65rem" }}>
                    {servicio.tipo}
                  </span>
                  <h5 className="fw-bolder text-dark mb-2 tracking-tight position-relative z-index-2">
                    {servicio.nombre}
                  </h5>
                  <p className="text-muted small mb-4 flex-grow-1 position-relative z-index-2" style={{ lineHeight: 1.6 }}>
                    {servicio.descripcion}
                  </p>
                  <div className="position-relative z-index-2 border-top pt-3" style={{ borderColor: 'rgba(0,0,0,0.05)!important' }}>
                    <h4 className="fw-bolder text-success mb-3 tracking-tight">
                      {formatPriceCLP(servicio.precio)}
                    </h4>
                    <button onClick={() => handleAddToCart(servicio)} className="btn btn-dark w-100 fw-bold rounded-pill apple-btn py-2">
                      Adquirir Plan
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 opacity-50">
              <div className="fs-1 text-muted mb-2">🔍</div>
              <p className="text-muted fw-medium tracking-tight">Cargando catálogo clínico...</p>
            </div>
          )}
        </div>
      </div>

      {/* Bento Grid de Especialidades */}
      <div className="container my-5 py-4" id="servicios">
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

      {/* Sobre NutriVida */}
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
            {/* El contenedor ahora tiene overflow-hidden para enmarcar el overlay de éxito */}
            <div className="glass-panel p-4 rounded-4 h-100 position-relative overflow-hidden">
              
              {/* STATEFUL GLASS OVERLAY: Pantalla de Éxito Integrada */}
              {mostrarExito && (
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center p-4"
                  style={{
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    animation: 'fadeIn 0.4s ease-out'
                  }}
                >
                  <div className="mb-3 d-flex justify-content-center align-items-center rounded-circle shadow-glass" style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9' }}>
                    <span className="fs-1">✨</span>
                  </div>
                  <h3 className="fw-bolder text-dark tracking-tight mb-2">¡Solicitud Enviada!</h3>
                  <p className="text-muted small mb-4" style={{ maxWidth: '280px' }}>
                    Tu información ha sido recibida correctamente. Nuestro equipo clínico se pondrá en contacto contigo a la brevedad.
                  </p>
                  <button onClick={handleResetForm} className="btn-kinetic-secondary text-decoration-none">
                    Enviar otra consulta
                  </button>
                </div>
              )}

              {/* Formulario que se desvanece suavemente cuando hay éxito */}
              <form 
                className="formulario" 
                onSubmit={handleSubmit}
                style={{ 
                  opacity: mostrarExito ? 0 : 1, 
                  pointerEvents: mostrarExito ? 'none' : 'auto',
                  transition: 'opacity 0.4s ease' 
                }}
              >
                
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