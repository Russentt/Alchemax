import { useState, useEffect, type JSX } from "react";
import { useParams, Link } from "react-router";
import { articlesDatabase } from "../data/articles";
import "../index.css";

export default function Article(): JSX.Element {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articleId ? articlesDatabase[articleId] : undefined;

  // Estados para la experiencia de lectura estilo Kindle
  const [fontSize, setFontSize] = useState<number>(1.1); // Tamaño base en rem
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const isControlsVisible = true;

  // Calcula el progreso de lectura al hacer scroll
  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const progress = Number(((currentScrollY / scrollHeight) * 100).toFixed(2));
        setReadingProgress(progress);
      }
      
      // Oculta los controles si el usuario hace scroll hacia abajo muy rápido (inmersión)
      // y los muestra al subir. Por simplicidad y UX en artículos cortos, los dejaremos visibles.
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Funciones de Accesibilidad Tipográfica
  const handleIncreaseFont = () => setFontSize((prev) => Math.min(prev + 0.1, 1.5));
  const handleDecreaseFont = () => setFontSize((prev) => Math.max(prev - 0.1, 0.9));

  // Renderizado de estado 404 Vanguardista
  if (!article) {
    return (
      <main className="app-wrapper min-vh-100 d-flex justify-content-center align-items-center position-relative py-5">
        <div className="ambient-glow-health"></div>
        <div className="glass-panel p-5 rounded-5 text-center position-relative z-index-2 shadow-glass" style={{ maxWidth: '500px', animation: 'fadeSlideUp 0.4s ease-out' }}>
          <div className="fs-1 mb-3" style={{ filter: 'grayscale(100%) opacity(50%)' }}>📄</div>
          <h3 className="fw-bolder text-dark mb-2 tracking-tight">Investigación no encontrada</h3>
          <p className="text-muted mb-4">
            El documento clínico que buscas no existe o ha sido archivado en nuestro repositorio interno[cite: 15].
          </p>
          <Link to="/blog" className="btn-kinetic-secondary text-decoration-none d-inline-flex">
            Volver al Directorio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-wrapper position-relative flex-grow-1 bg-white pb-5">
      
      {/* 1. Barra de Progreso de Lectura (Fija en la parte superior) */}
      <div className="position-fixed top-0 start-0 w-100" style={{ height: '4px', zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.05)' }}>
        <div 
          className="h-100 transition-all" 
          style={{ 
            width: `${readingProgress}%`, 
            background: `var(--bs-${article.theme || 'success'})`,
            boxShadow: `0 0 10px var(--bs-${article.theme || 'success'})`
          }} 
        />
      </div>

      {/* 2. Píldora de Controles de Lectura (Kindle-like Floating Bar) */}
      <div 
        className="position-fixed bottom-0 start-50 translate-middle-x mb-4 transition-all" 
        style={{ 
          zIndex: 1050, 
          opacity: isControlsVisible ? 1 : 0, 
          transform: isControlsVisible ? 'translateY(0)' : 'translateY(20px)',
          animation: 'fadeSlideUp 0.6s var(--ease-spring) 0.5s both'
        }}
      >
        <div className="glass-panel-small p-2 rounded-pill shadow-lg d-flex align-items-center gap-1 border border-opacity-10" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)' }}>
          <button 
            onClick={handleDecreaseFont} 
            className="btn btn-sm btn-light rounded-circle fw-bold d-flex justify-content-center align-items-center hover-lift" 
            style={{ width: '40px', height: '40px', fontSize: '0.9rem', color: '#1d1d1f' }}
            title="Reducir tamaño de letra"
            disabled={fontSize <= 0.9}
          >
            A-
          </button>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(0,0,0,0.1)', margin: '0 4px' }}></div>
          <button 
            onClick={handleIncreaseFont} 
            className="btn btn-sm btn-light rounded-circle fw-bold d-flex justify-content-center align-items-center hover-lift" 
            style={{ width: '40px', height: '40px', fontSize: '1.1rem', color: '#1d1d1f' }}
            title="Aumentar tamaño de letra"
            disabled={fontSize >= 1.5}
          >
            A+
          </button>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(0,0,0,0.1)', margin: '0 4px' }}></div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn btn-sm btn-light rounded-circle d-flex justify-content-center align-items-center hover-lift" 
            style={{ width: '40px', height: '40px', color: '#1d1d1f' }}
            title="Volver arriba"
          >
            ↑
          </button>
        </div>
      </div>

      <div className="container py-4 position-relative z-index-2">
        
        {/* Navegación sutil y limpia */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb d-inline-flex px-3 py-1 bg-light rounded-pill mb-0" style={{ fontSize: '0.85rem' }}>
            <li className="breadcrumb-item">
              <Link to="/" className="text-muted text-decoration-none hover-lift">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blog" className="text-muted text-decoration-none hover-lift">Evidencia Clínica</Link>
            </li>
            <li className="breadcrumb-item active fw-bold text-dark text-truncate" style={{ maxWidth: "150px" }}>
              {article.title}
            </li>
          </ol>
        </nav>

        <article className="mx-auto" style={{ maxWidth: '800px', animation: 'fadeIn 0.6s ease-out' }}>
          
          {/* Cabecera Editorial Inmersiva */}
          <header className="mb-5 text-center text-md-start">
            <span className={`badge bg-${article.theme}-subtle text-${article.theme} mb-4 px-3 py-2 rounded-pill fw-bold tracking-tight text-uppercase`}>
              {article.badgeText}
            </span>
            <h1 className="display-4 fw-bolder text-dark mb-4 tracking-tight" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {article.title}
            </h1>
            
            <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center gap-3 border-top border-bottom py-3 border-opacity-10 mt-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-sm" style={{ width: "44px", height: "44px" }}>
                  NV
                </div>
                <div className="text-start">
                  <h6 className="mb-0 fw-bold text-dark tracking-tight">Comité de Investigación Clínica</h6>
                  <span className="text-muted small">Revisión Científica • NutriVida</span>
                </div>
              </div>
              <div className="text-md-end text-center">
                <div className="fw-semibold text-dark small">{article.date}</div>
                <div className="text-muted small">⏱️ {article.readTime} min de lectura ininterrumpida</div>
              </div>
            </div>
          </header>

          {/* Cuerpo del Artículo (Lectura Optimizada) */}
          <div 
            className="article-content mx-auto" 
            style={{ 
              maxWidth: "680px", // Ancho óptimo para seguimiento ocular (60-75 caracteres)
              transition: "font-size 0.3s ease" 
            }}
          >
            {article.content.map((paragraph, index) => {
              // Aplicar Letra Capitular (Drop Cap) solo al primer párrafo para estética editorial
              if (index === 0) {
                return (
                  <p
                    key={index}
                    className="text-dark mb-4"
                    style={{ 
                      fontSize: `${fontSize}rem`, 
                      lineHeight: 1.8, 
                      textAlign: "left", // Izquierda alineada es más accesible que justificado
                      color: "#1d1d1f"
                    }}
                  >
                    <span 
                      className="float-start fw-bolder lh-1 pe-2 text-dark" 
                      style={{ fontSize: `${fontSize * 3.5}rem`, marginTop: '-0.1rem' }}
                    >
                      {paragraph.charAt(0)}
                    </span>
                    {paragraph.substring(1)}
                  </p>
                );
              }

              return (
                <p
                  key={index}
                  className="text-dark mb-4"
                  style={{ 
                    fontSize: `${fontSize}rem`, 
                    lineHeight: 1.8, 
                    textAlign: "left",
                    color: "#1d1d1f"
                  }}
                >
                  {paragraph}
                </p>
              );
            })}

            {/* Separador Elegante */}
            <div className="d-flex justify-content-center align-items-center gap-2 my-5 opacity-25">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1d1d1f' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1d1d1f' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1d1d1f' }}></span>
            </div>

            {/* CTA Final Integrado (No intrusivo) */}
            <div className="glass-panel p-4 p-md-5 rounded-5 text-center mt-5 mb-5 border-0 shadow-glass" style={{ background: 'linear-gradient(135deg, rgba(248,249,250,1) 0%, rgba(241,243,245,1) 100%)' }}>
              <div className="fs-1 mb-3">🩺</div>
              <h4 className="fw-bolder text-dark tracking-tight mb-3">
                ¿Buscas adaptar esta evidencia a tu metabolismo?
              </h4>
              <p className="text-muted mb-4 fs-6 mx-auto" style={{ maxWidth: '500px' }}>
                Nuestros profesionales clínicos pueden evaluar tus requerimientos basales a través de una sesión biométrica 100% personalizada[cite: 15].
              </p>
              <Link to="/#contact" className="btn-kinetic-health text-decoration-none d-inline-flex shadow-sm">
                <span className="btn-text">Agendar Evaluación Médica</span>
                <span className="btn-icon">→</span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}