import { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import type { Categoria, Servicio } from "../types/index";
import { TiendaService } from "../services/tiendaService";
import { StorageUsuario } from "../services/storageUsuario";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";
import { formatPriceCLP } from "../utils/formatPriceCLP";

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};

export default function Metodologia(): JSX.Element {
  const navigate = useNavigate();

  const [servicios] = useState<Servicio[]>(() =>
    StorageServicios.getServicios().filter(
      (s) => !s.estado || s.estado === "Activo",
    ),
  );
  const [categorias] = useState<Categoria[]>(() =>
    StorageCategorias.getCategorias() || [],
  );
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");

  // Nuevo estado para controlar el modal de redirección suave
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const serviciosFiltrados = servicios.filter((servicio) => {
    if (categoriaActiva === "todas") return true;
    return String(servicio.categoriaId) === String(categoriaActiva);
  });

  const serviciosChunked = chunkArray(serviciosFiltrados, 4);

  const [triageForm, setTriageForm] = useState({
    peso: "",
    altura: "",
    objetivo: "mantener",
  });
  
  const [triageResult, setTriageResult] = useState<{
    imc: number;
    diagnostico: string;
    color: string;
    recomendacion: string;
  } | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "warning";
  } | null>(null);

  const handleTriageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setTriageForm({ ...triageForm, [e.target.name]: e.target.value });
  };

  const handleTriageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const peso = parseFloat(triageForm.peso);
    const altura = parseFloat(triageForm.altura) / 100;

    if (!peso || !altura || altura <= 0) return;

    const imc = parseFloat((peso / (altura * altura)).toFixed(1));
    const diagnostico = imc < 18.5
      ? {
          diagnostico: "Bajo Peso",
          color: "warning",
          recomendacion: "Sugerimos un Plan Clínico enfocado en superávit calórico controlado y ganancia de masa magra.",
        }
      : imc <= 24.9
        ? {
            diagnostico: "Normopeso",
            color: "success",
            recomendacion: triageForm.objetivo === "rendimiento"
              ? "Estás en un rango óptimo. Te sugerimos el Plan Nutricional Deportivo para potenciar tu rendimiento."
              : "Estás en un rango óptimo. Una Evaluación Biométrica Inicial nos ayudará a afinar tus hábitos actuales.",
          }
        : imc <= 29.9
          ? {
              diagnostico: "Sobrepeso",
              color: "warning",
              recomendacion: "Sugerimos una Evaluación Biométrica Inicial para diseñar un déficit calórico que proteja tu masa muscular.",
            }
          : {
              diagnostico: "Obesidad",
              color: "danger",
              recomendacion: "Te recomendamos encarecidamente nuestro Plan Nutricional Clínico para un abordaje metabólico integral.",
            };

    setTriageResult({ imc, ...diagnostico });
  };

  const handleAddToCart = (servicio: Servicio) => {
    const sesionActual = StorageUsuario.getUsuarioSesion();

    if (!sesionActual) {
      setNotification({
        message: "Acceso requerido para reservar este servicio.",
        type: "warning",
      });
      
      // Activamos el modal de transición
      setIsRedirecting(true);

      // Aumentamos el tiempo a 3.5s para permitir la lectura y ver la animación
      setTimeout(() => {
        setNotification(null);
        setIsRedirecting(false);
        navigate("/login");
      }, 3500);
      return;
    }

    TiendaService.agregarAlCarrito(servicio);

    setNotification({
      message: `¡"${servicio.nombre}" añadido a tu carrito! Puedes ir a pagar para asignarlo a tu cuenta.`,
      type: "success",
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <main className="app-wrapper py-5 position-relative">
      <div className="ambient-glow-health"></div>

      {/* Modal de Transición Suave (Redirección a Login) */}
      {isRedirecting && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ 
            zIndex: 1050, // Justo por debajo de la notificación para que ambas sean visibles
            background: 'rgba(250, 250, 250, 0.4)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.5s ease-out' 
          }}
        >
          <div className="glass-panel p-5 rounded-5 text-center shadow-glass d-flex flex-column align-items-center" style={{ animation: "fadeSlideUp 0.6s var(--ease-spring)" }}>
            <div className="spinner-border text-success mb-4" role="status" style={{ width: '3rem', height: '3rem', borderWidth: '0.25em' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h3 className="fw-bolder text-dark tracking-tight mb-2">Preparando entorno</h3>
            <p className="text-muted mb-0">Redirigiendo al portal seguro...</p>
          </div>
        </div>
      )}

      {/* Sistema de Notificaciones Flotante tipo Isla (Mantenido sobre el modal) */}
      {notification && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-4" style={{ zIndex: 1100, marginTop: "80px", animation: "fadeSlideUp 0.4s var(--ease-spring)" }}>
          <div className="glass-panel-small px-4 py-3 rounded-pill d-flex align-items-center gap-3 shadow-glass" role="alert">
            <span className="fs-5">{notification.type === "success" ? "✅" : "⚠️"}</span>
            <span className="fw-semibold text-dark mb-0 small">{notification.message}</span>
            {notification.type === "success" && (
              <Link to="/carrito" className="btn-kinetic-health text-decoration-none py-1 px-3 ms-2" style={{ fontSize: '0.8rem' }}>
                Ir al carrito
              </Link>
            )}
            {/* Si está redirigiendo, ocultamos el botón de cerrar para evitar interrupciones */}
            {!isRedirecting && (
              <button type="button" className="btn-close ms-2" onClick={() => setNotification(null)} aria-label="Close"></button>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section container d-flex flex-column justify-content-center align-items-center text-center mt-4">
        <span className="badge bg-white text-success shadow-sm mb-4 px-4 py-2 rounded-pill fw-bold tracking-tight" style={{ border: '1px solid rgba(39, 174, 96, 0.2)'}}>
          NUESTRO ENFOQUE
        </span>
        <div className="hero-text-mask">
          <h1 className="hero-title display-2 fw-bolder tracking-tight text-dark">
            Ciencia, no <span className="text-gradient-health">restricciones.</span>
          </h1>
        </div>
        <p className="hero-subtitle mt-4 text-muted fs-5 fade-up-delay mx-auto" style={{ maxWidth: "750px" }}>
          Rechazamos las dietas genéricas. Utilizamos tecnología biométrica y evidencia clínica actualizada para diseñar pautas metabólicas que se adaptan a tu estilo de vida.
        </p>
      </section>

      {/* Triage Clínico */}
      <section className="container px-4 px-md-5 my-5 z-index-2 position-relative fade-up-delay-2">
        <div className="glass-card p-4 p-md-5 rounded-5 border-0">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 pe-lg-5">
              <div className="mb-4">
                <h3 className="fw-bold text-dark tracking-tight">Calculadora de Triage</h3>
                <p className="text-muted small">Algoritmo de diagnóstico preliminar para sugerir tu ruta clínica ideal.</p>
              </div>
              <form onSubmit={handleTriageSubmit}>
                <div className="row g-3">
                  <div className="col-md-6 mb-2">
                    <label className="form-label text-dark fw-semibold small text-uppercase tracking-tight">Peso (kg)</label>
                    <input type="number" step="0.1" name="peso" className="form-control apple-input" placeholder="Ej: 70.5" value={triageForm.peso} onChange={handleTriageChange} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label text-dark fw-semibold small text-uppercase tracking-tight">Estatura (cm)</label>
                    <input type="number" name="altura" className="form-control apple-input" placeholder="Ej: 171" value={triageForm.altura} onChange={handleTriageChange} required />
                  </div>
                </div>
                <div className="mb-4 mt-2">
                  <label className="form-label text-dark fw-semibold small text-uppercase tracking-tight">Objetivo Principal</label>
                  <select name="objetivo" className="form-select apple-input" value={triageForm.objetivo} onChange={handleTriageChange}>
                    <option value="bajar">Reducción de porcentaje de grasa</option>
                    <option value="mantener">Mantenimiento y reeducación alimentaria</option>
                    <option value="rendimiento">Aumento de masa muscular / Rendimiento</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold apple-btn py-3">
                  Procesar Biometría
                </button>
              </form>
            </div>

            <div className="col-lg-6 ps-lg-5 border-start-lg border-success border-opacity-10 text-center text-lg-start">
              {!triageResult ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 opacity-50 py-5">
                  <div className="fs-1 mb-3" style={{ filter: 'grayscale(100%)' }}>🩺</div>
                  <p className="text-muted fw-medium tracking-tight">Esperando parámetros biológicos...</p>
                </div>
              ) : (
                <div style={{ animation: "fadeSlideUp 0.4s var(--ease-spring)" }}>
                  <span className="text-uppercase tracking-tight fw-bold text-muted small">Tu Índice Biométrico</span>
                  <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 my-3">
                    <h1 className="display-1 fw-bolder text-dark mb-0 tracking-tight" style={{ letterSpacing: '-0.06em' }}>
                      {triageResult.imc}
                    </h1>
                    <span className={`badge bg-${triageResult.color} px-3 py-2 rounded-pill fw-bold shadow-sm`}>
                      {triageResult.diagnostico}
                    </span>
                  </div>
                  <div className="glass-panel-small p-4 rounded-4 text-start">
                    <p className="mb-0 text-dark fw-medium small lh-lg">
                      {triageResult.recomendacion}
                    </p>
                  </div>
                  <a href="#catalogo" className="btn-kinetic-secondary mt-4 text-decoration-none d-inline-flex">
                    Ver catálogo sugerido ↓
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo Clínico */}
      <section id="catalogo" className="py-5 position-relative z-index-2">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark tracking-tight">Catálogo de Servicios Clínicos</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Selecciona el plan sugerido en tu Triage o inicia con una evaluación general. Cada plan incluye acceso a nuestro ecosistema digital.
            </p>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5 p-1 rounded-pill mx-auto" style={{ background: 'rgba(0,0,0,0.03)', maxWidth: 'fit-content' }}>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${categoriaActiva === "todas" ? "bg-white text-dark shadow-sm" : "btn-link text-muted text-decoration-none"}`}
              onClick={() => setCategoriaActiva("todas")}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${categoriaActiva === cat.id ? "bg-white text-dark shadow-sm" : "btn-link text-muted text-decoration-none"}`}
                onClick={() => setCategoriaActiva(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div key={categoriaActiva} id="catalogoCarousel" className="carousel slide" data-bs-ride="false" data-bs-interval="false">
            <div className="carousel-inner px-2 py-4">
              {serviciosChunked.length === 0 ? (
                <div className="col-12 text-center py-5 opacity-50">
                  <div className="fs-1 text-muted mb-2">🔍</div>
                  <h5 className="text-muted fw-semibold tracking-tight">Sin servicios en esta categoría.</h5>
                </div>
              ) : (
                serviciosChunked.map((chunk, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <div className="row g-4 justify-content-center">
                      {chunk.map((servicio) => (
                        <div key={servicio.id} className="col-12 col-md-6 col-lg-3">
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
                                + Añadir
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {serviciosChunked.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#catalogoCarousel" data-bs-slide="prev" style={{ width: "5%", left: "-2%" }}>
                  <span className="carousel-control-prev-icon bg-dark rounded-circle p-3 shadow-glass" style={{ backgroundSize: '40%' }} aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#catalogoCarousel" data-bs-slide="next" style={{ width: "5%", right: "-2%" }}>
                  <span className="carousel-control-next-icon bg-dark rounded-circle p-3 shadow-glass" style={{ backgroundSize: '40%' }} aria-hidden="true"></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-5 pt-3">
            <Link to="/carrito" className="btn-kinetic-health text-decoration-none shadow-glass">
              <span className="btn-text">Proceder al pago</span>
              <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}