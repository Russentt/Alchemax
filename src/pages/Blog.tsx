import { type JSX } from "react";
import { Link } from "react-router";
import ArticleCard from "../components/ArticleCard";
import { articlesDatabase } from "../data/articles";

export default function Blog(): JSX.Element {
  // Convertimos el objeto de la base de datos en un array para iterar
  const articlesList = Object.values(articlesDatabase);

  // Separamos el artículo destacado del resto
  const featuredArticle = articlesDatabase["probioticos-insulina"];
  const gridArticles = articlesList.filter(
    (article) => article.id !== featuredArticle.id,
  );

  return (
    <main className="container my-5 px-3 px-md-4 flex-grow-1">
      <nav aria-label="breadcrumb" className="mb-5">
        <ol className="breadcrumb p-3 bg-white rounded-3 shadow-sm flex-nowrap overflow-auto">
          <li className="breadcrumb-item text-nowrap">
            <Link to="/" className="text-success text-decoration-none">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item text-nowrap active">
            Artículos Clínicos
          </li>
        </ol>
      </nav>

      <div className="text-center mb-5 px-2">
        <h1 className="display-5 fw-bold text-success mb-3">
          Evidencia y Divulgación Nutricional
        </h1>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
          Artículos redactados por nuestro equipo clínico para desmitificar la
          nutrición y guiarte hacia un estilo de vida basado en ciencia.
        </p>
      </div>

      {/* Artículo Destacado Dinámico */}
      <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden bg-white">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 bg-success text-white p-5 d-flex flex-column justify-content-center min-vh-25">
            <span className="badge bg-light text-success align-self-start mb-3 px-3 py-2 rounded-pill">
              {featuredArticle.badgeText}
            </span>
            <h2 className="fw-bold display-6 mb-3">{featuredArticle.title}</h2>
            <p className="opacity-75 mb-0">{featuredArticle.description}</p>
          </div>
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between h-100">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                  style={{ width: "40px", height: "40px" }}
                >
                  NV
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Equipo NutriVida</h6>
                  <small className="text-muted">
                    {featuredArticle.date} • {featuredArticle.readTime} min de
                    lectura
                  </small>
                </div>
              </div>
              <p className="text-muted lh-lg mb-4">
                {featuredArticle.content[0]}
              </p>
            </div>

            <Link
              to={`/blog/${featuredArticle.id}`}
              className="btn btn-outline-success fw-bold align-self-start mt-3"
            >
              Leer investigación completa
            </Link>
          </div>
        </div>
      </div>

      {/* Grilla Dinámica de Artículos */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {gridArticles.map((article) => (
          <ArticleCard
            key={article.id}
            theme={article.theme}
            badgeText={article.badgeText}
            title={article.title}
            description={article.description}
            readTime={article.readTime}
            linkTo={`/blog/${article.id}`}
          />
        ))}
      </div>

      {/* Sección de Suscripción */}
      <section className="bg-success text-white p-4 p-md-5 rounded-4 shadow-lg mb-4 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h3 className="fw-bold mb-3">
              Suscríbete a nuestro boletín clínico
            </h3>
            <p className="mb-4 opacity-75">
              Recibe cada lunes un resumen con evidencia científica directa en
              tu correo, libre de mitos comerciales.
            </p>
            <form
              className="row g-3 justify-content-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="col-12 col-sm-8">
                <input
                  type="email"
                  className="form-control form-control-lg border-0 shadow-sm"
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>
              <div className="col-12 col-sm-4 d-grid">
                <button
                  type="submit"
                  className="btn btn-dark fw-bold py-3 shadow-sm"
                >
                  Suscribirme
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
