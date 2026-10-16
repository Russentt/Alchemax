import { useState, useMemo, type JSX } from "react";
import { Link } from "react-router";
import { articlesDatabase } from "../data/articles";
import "../index.css"; 

export default function Blog(): JSX.Element {
  const articlesList = Object.values(articlesDatabase);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [visibleCount, setVisibleCount] = useState(7); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    articlesList.forEach(article => {
      counts[article.badgeText] = (counts[article.badgeText] || 0) + 1;
    });
    
    const sortedUnique = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return ["Todos", ...sortedUnique];
  }, [articlesList]);

  const visibleCategories = categories.slice(0, 3);
  const isHiddenActive = !visibleCategories.includes(activeCategory);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredArticles = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return articlesList.filter((article) => {
      const matchSearch =
        normalizedSearch === "" ||
        normalizeText(article.title).includes(normalizedSearch) ||
        normalizeText(article.description).includes(normalizedSearch) ||
        normalizeText(article.content.join(" ")).includes(normalizedSearch);
        
      const matchCategory =
        activeCategory === "Todos" || article.badgeText === activeCategory;
        
      return matchSearch && matchCategory;
    });
  }, [searchTerm, activeCategory, articlesList]);

  const featuredArticle = filteredArticles[0]; 
  const gridArticles = filteredArticles.slice(1, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(7);
    setIsModalOpen(false);
  };

  return (
    <main className="app-wrapper py-4 py-lg-5 position-relative flex-grow-1">
      <div className="ambient-glow-health"></div>

      {/* ==========================================
          MODAL DE DIRECTORIO DE ESPECIALIDADES (CORREGIDO)
          ========================================== */}
      {isModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3 p-md-4" 
          style={{ 
            zIndex: 2000, 
            background: 'rgba(250, 250, 250, 0.5)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease-out' 
          }}
          onClick={() => setIsModalOpen(false)} 
        >
          {/* Contenedor Flex: Header Fijo + Body Scrolleable */}
          <div 
            className="glass-panel rounded-5 shadow-lg w-100 position-relative d-flex flex-column overflow-hidden bg-white" 
            style={{ maxWidth: '700px', maxHeight: '90vh', animation: 'fadeSlideUp 0.4s var(--ease-spring)' }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header Fijo */}
            <div className="d-flex justify-content-between align-items-center p-4 p-md-5 border-bottom" style={{ zIndex: 10, background: 'rgba(255,255,255,0.95)' }}>
              <div>
                <h3 className="fw-bolder text-dark tracking-tight mb-1">Directorio Clínico</h3>
                <p className="text-muted small mb-0">Explora todas nuestras áreas de investigación</p>
              </div>
              <button 
                type="button" 
                className="btn-close bg-light rounded-circle p-2 shadow-sm" 
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar modal"
              ></button>
            </div>

            {/* Body Scrolleable */}
            <div className="p-4 p-md-5 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              <div className="row g-3">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <div className="col-12 col-sm-6" key={cat}>
                      <button
                        onClick={() => handleSelectCategory(cat)}
                        className={`btn w-100 text-start p-3 rounded-4 transition-all d-flex align-items-center justify-content-between border-0 ${
                          isActive 
                            ? "bg-dark text-white shadow-sm" 
                            : "bg-light text-dark shadow-sm hover-lift"
                        }`}
                      >
                        <span className="fw-bold tracking-tight">{cat}</span>
                        {isActive && (
                          <span className="badge bg-white bg-opacity-25 rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container position-relative" style={{ zIndex: 2 }}>
        
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb d-inline-flex px-4 py-2 bg-white rounded-pill shadow-sm border mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-success text-decoration-none fw-semibold hover-lift">
                Inicio
              </Link>
            </li>
            <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">
              Evidencia Clínica
            </li>
          </ol>
        </nav>

        <div className="text-center mb-5 fade-up-delay">
          <h1 className="display-4 fw-bolder text-dark mb-3 tracking-tight">
            Ciencia Aplicada a tu <span className="text-gradient-health">Nutrición.</span>
          </h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
            Explora nuestro repositorio clínico. Desmitificamos la nutrición integrando evidencia médica actualizada a tu día a día.
          </p>
        </div>

        {/* BARRA DE COMANDOS UNIFICADA */}
        <div className="glass-panel p-2 p-md-3 rounded-pill shadow-sm mb-5 d-flex flex-column flex-lg-row align-items-center gap-2 gap-lg-3 mx-auto" style={{ maxWidth: "1000px" }}>
          
          <div className="position-relative flex-grow-1 w-100 px-2">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 fs-5 opacity-50">🔍</span>
            <input
              type="search"
              className="form-control border-0 bg-transparent py-2 ps-5 fw-medium text-dark shadow-none"
              placeholder="Buscar condiciones, alimentos, patologías..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(7); 
              }}
              aria-label="Buscar artículos clínicos"
            />
          </div>
          
          <div className="d-none d-lg-block flex-shrink-0 rounded-pill" style={{ width: '2px', height: '30px', backgroundColor: 'rgba(0,0,0,0.06)' }}></div>
          
          <div className="d-flex flex-wrap flex-sm-nowrap justify-content-center align-items-center gap-2 w-100 w-lg-auto px-2">
            {visibleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(7);
                }}
                className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-dark text-white shadow-sm"
                    : "bg-transparent text-muted hover-lift"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="position-relative flex-shrink-0">
              <button
                className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap transition-all d-flex align-items-center gap-2 ${
                  isHiddenActive
                    ? "bg-dark text-white shadow-sm"
                    : "bg-transparent text-muted hover-lift"
                }`}
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
                <span>{isHiddenActive ? activeCategory : "Explorar Especialidades"}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RESULTADOS Y CONTENIDO */}
        {filteredArticles.length === 0 ? (
          <div className="glass-panel p-5 rounded-5 text-center my-5">
            <div className="fs-1 mb-3">🔬</div>
            <h4 className="fw-bolder text-dark tracking-tight">Sin resultados</h4>
            <p className="text-muted">No encontramos evidencia clínica que coincida con "{searchTerm}".</p>
            <button onClick={() => { setSearchTerm(""); setActiveCategory("Todos"); }} className="btn-kinetic-secondary mt-3">
              Restablecer búsqueda
            </button>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <article className="glass-panel p-0 rounded-5 mb-5 overflow-hidden border-0 position-relative hover-lift" style={{ animation: "fadeSlideUp 0.4s ease-out" }}>
                <div className="row g-0 align-items-stretch">
                  <div className="col-lg-6 position-relative p-5 d-flex flex-column justify-content-center min-vh-25" style={{ background: `linear-gradient(135deg, var(--bs-${featuredArticle.theme || 'success'}) 0%, #1a4d2e 100%)` }}>
                    <div className="position-absolute top-0 end-0 p-4 opacity-10 fs-1" style={{ transform: 'scale(4) translate(10%, -10%)' }}>
                      {featuredArticle.theme === "info" ? "🧬" : "🥗"}
                    </div>
                    <div className="position-relative z-index-2">
                      <span className="badge bg-white text-dark shadow-sm align-self-start mb-4 px-3 py-2 rounded-pill fw-bold tracking-tight text-uppercase">
                        ✨ Destacado: {featuredArticle.badgeText}
                      </span>
                      <h2 className="fw-bolder display-5 text-white mb-3 tracking-tight lh-sm">{featuredArticle.title}</h2>
                      <p className="text-white opacity-75 fs-5 mb-0 fw-light">{featuredArticle.description}</p>
                    </div>
                  </div>
                  <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between bg-white bg-opacity-75">
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3 border-opacity-10">
                        <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-sm" style={{ width: "48px", height: "48px" }}>
                          NV
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-dark tracking-tight">Comité Clínico NutriVida</h6>
                          <small className="text-muted fw-medium">
                            🗓️ {featuredArticle.date} • ⏱️ {featuredArticle.readTime} min lectura
                          </small>
                        </div>
                      </div>
                      <p className="text-dark opacity-75 lh-lg mb-4 fs-6">
                        {featuredArticle.content[0].substring(0, 220)}...
                      </p>
                    </div>
                    <Link to={`/blog/${featuredArticle.id}`} className="btn-kinetic-health text-decoration-none align-self-start shadow-sm">
                      <span className="btn-text">Leer investigación</span>
                      <span className="btn-icon">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            )}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
              {gridArticles.map((article) => (
                <div key={article.id} className="col" style={{ animation: "fadeIn 0.5s ease-out" }}>
                  <article className="glass-panel-small h-100 rounded-5 hover-lift p-4 d-flex flex-column position-relative border-0 bg-white">
                    <div className="mb-3 d-flex justify-content-between align-items-start">
                      <span className={`badge bg-${article.theme}-subtle text-${article.theme} rounded-pill px-3 py-2 fw-bold tracking-tight`}>
                        {article.badgeText}
                      </span>
                      <span className="text-muted small fw-semibold">⏱️ {article.readTime} min</span>
                    </div>
                    <h4 className="fw-bolder text-dark mb-2 tracking-tight lh-sm" style={{ fontSize: '1.25rem' }}>
                      {article.title}
                    </h4>
                    <p className="text-muted small flex-grow-1 mb-4" style={{ lineHeight: 1.6 }}>
                      {article.description}
                    </p>
                    <div className="border-top pt-3 mt-auto" style={{ borderColor: 'rgba(0,0,0,0.05)!important' }}>
                      <Link to={`/blog/${article.id}`} className="text-success text-decoration-none fw-bold small d-flex align-items-center gap-1 group">
                        Leer artículo completo <span className="transition-transform group-hover-translate-x">→</span>
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mb-5">
                <button 
                  onClick={handleLoadMore} 
                  className="btn-kinetic-secondary shadow-sm px-5 py-3 d-inline-flex align-items-center gap-3 border-0 bg-white"
                  style={{ borderRadius: '50px' }}
                >
                  <span className="fw-bolder tracking-tight text-dark">Cargar más artículos</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                <p className="text-muted small mt-3 fw-medium">
                  Mostrando {featuredArticle ? gridArticles.length + 1 : 0} de {filteredArticles.length} publicaciones.
                </p>
              </div>
            )}
          </>
        )}

        {/* Sección de Suscripción */}
        <section className="position-relative p-1 rounded-5 shadow-glass mb-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #1a4d2e 100%)' }}>
          <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', top: '-50%', left: '-10%' }}></div>
          <div className="position-absolute rounded-circle" style={{ width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', bottom: '-20%', right: '-5%' }}></div>
          
          <div className="position-relative z-index-2 p-4 p-md-5 text-center text-white">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="mb-3 d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 className="fw-bolder mb-3 tracking-tight display-6">
                  Newsletter Clínico NutriVida
                </h3>
                <p className="mb-4 opacity-90 fw-light fs-5 mx-auto" style={{ maxWidth: '600px' }}>
                  Recibe cada lunes un resumen con evidencia científica directa en tu correo, libre de mitos comerciales y tendencias tóxicas.
                </p>
                <form className="d-flex flex-column flex-sm-row justify-content-center gap-2 max-w-md mx-auto" style={{ maxWidth: '500px' }} onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    className="form-control form-control-lg border-0 px-4 fw-medium"
                    placeholder="tucorreo@ejemplo.com"
                    style={{ borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    required
                    aria-label="Correo electrónico para suscripción"
                  />
                  <button type="submit" className="btn btn-dark btn-lg fw-bold px-4" style={{ borderRadius: '50px', whiteSpace: 'nowrap' }}>
                    Suscribirme
                  </button>
                </form>
                <small className="d-block mt-3 opacity-50 fw-medium">Respetamos tu privacidad. Cero spam, 100% ciencia.</small>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}