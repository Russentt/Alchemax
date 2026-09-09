const articles = [
  { category: 'Metabolismo', badgeClass: 'bg-success-subtle text-success', title: '¿Por qué el déficit calórico extremo arruina tu metabolismo basal?', excerpt: 'Analizamos la termogénesis adaptativa y cómo el cuerpo reduce el gasto energético espontáneo (NEAT) cuando restringimos calorías de forma agresiva sin supervisión clínica.', time: '4 min de lectura' },
  { category: 'Deporte y Rendimiento', badgeClass: 'bg-info-subtle text-info', title: 'Creatina monohidratada: más allá del rendimiento muscular', excerpt: 'Nuevos metaanálisis demuestran beneficios cognitivos, neuroprotectores y de modulación glucémica en adultos que no necesariamente realizan alta competición deportiva.', time: '5 min de lectura' },
  { category: 'Nutrición Basada en Plantas', badgeClass: 'bg-warning-subtle text-dark', title: 'Planificación segura de dietas vegetarianas en invierno', excerpt: 'Estrategias clave para asegurar la biodisponibilidad de Hierro no hemo, Zinc y Vitamina B12 durante los meses de menor exposición solar en el sur de Chile.', time: '7 min de lectura' },
  { category: 'Salud Digestiva', badgeClass: 'bg-danger-subtle text-danger', title: 'SIBO: Diagnóstico y abordaje nutricional', excerpt: 'El sobrecrecimiento bacteriano en el intestino delgado requiere protocolos específicos como la dieta baja en FODMAPs. Descubre sus fases y aplicación clínica.', time: '6 min de lectura' },
  { category: 'Inmunología', badgeClass: 'bg-primary-subtle text-primary', title: 'Vitamina D y sistema inmunológico', excerpt: 'Su rol preventivo en enfermedades respiratorias y la necesidad de suplementación protocolizada en regiones con baja radiación solar como La Araucanía.', time: '5 min de lectura' },
  { category: 'Hábitos', badgeClass: 'bg-secondary-subtle text-secondary', title: 'Ayuno intermitente: Mitos y realidades', excerpt: '¿Es realmente la herramienta definitiva para la pérdida de grasa? Evaluamos la evidencia sobre la restricción temporal de alimentos frente al déficit calórico tradicional.', time: '8 min de lectura' },
  { category: 'Nutrición Infantil', badgeClass: 'bg-success-subtle text-success', title: 'Alimentación complementaria (BLW)', excerpt: 'Cómo fomentar una relación saludable con la comida desde los 6 meses de edad, respetando las señales de saciedad y el desarrollo motor del lactante.', time: '6 min de lectura' },
  { category: 'Salud Femenina', badgeClass: 'bg-info-subtle text-info', title: 'Nutrición integral en el SOP', excerpt: 'Abordaje dietético específico para la resistencia a la insulina y la inflamación de bajo grado en el Síndrome de Ovario Poliquístico.', time: '7 min de lectura' },
  { category: 'Psicología Nutricional', badgeClass: 'bg-warning-subtle text-dark', title: 'Hambre emocional vs. fisiológica', excerpt: 'Herramientas de atención plena (Mindful Eating) para identificar gatillantes emocionales y gestionar los antojos sin recurrir a la restricción absoluta.', time: '5 min de lectura' }
];

const articlesPerPage = 3;
let currentPage = 1;

const renderArticles = (page) => {
  const start = (page - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const pageArticles = articles.slice(start, end);

  const container = document.querySelector('.row-cols-1.row-cols-md-2.row-cols-lg-3');
  if (!container) return;

  container.innerHTML = pageArticles.map(article => `
    <div class="col" style="animation: popIn 0.4s ease forwards;">
      <div class="card h-100 border-0 shadow-sm rounded-4 bg-white p-2">
        <div class="card-body d-flex flex-column p-4">
          <span class="badge ${article.badgeClass} align-self-start mb-3 px-3 py-1 rounded-pill">${article.category}</span>
          <h4 class="card-title fw-bold text-dark mb-3">${article.title}</h4>
          <p class="card-text text-muted small flex-grow-1 mb-4">${article.excerpt}</p>
          <div class="d-flex align-items-center justify-content-between border-top pt-3 mt-auto">
            <small class="text-muted">${article.time}</small>
            <a href="metodologia.html" class="text-success fw-bold text-decoration-none small">Leer más →</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
};

const updatePagination = (page) => {
  const paginationItems = document.querySelectorAll('.pagination .page-item');
  if (!paginationItems.length) return;

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  paginationItems.forEach(item => item.classList.remove('active', 'disabled'));

  if (page === 1) paginationItems[0].classList.add('disabled');
  if (page === totalPages) paginationItems[paginationItems.length - 1].classList.add('disabled');

  paginationItems.forEach((item, index) => {
    if (index > 0 && index < paginationItems.length - 1) {
      if (index === page) item.classList.add('active');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  renderArticles(currentPage);
  updatePagination(currentPage);

  const paginationLinks = document.querySelectorAll('.pagination .page-link');
  
  paginationLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const totalPages = Math.ceil(articles.length / articlesPerPage);
      
      if (index === 0) {
        if (currentPage > 1) currentPage--;
      } else if (index === paginationLinks.length - 1) {
        if (currentPage < totalPages) currentPage++;
      } else {
        currentPage = index;
      }
      
      renderArticles(currentPage);
      updatePagination(currentPage);
      
      const blogContainer = document.querySelector('.row-cols-1.row-cols-md-2.row-cols-lg-3');
      if (blogContainer) {
        window.scrollTo({
          top: blogContainer.offsetTop - 120,
          behavior: 'smooth'
        });
      }
    });
  });
});
