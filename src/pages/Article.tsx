import { type JSX } from "react";
import { useParams, Link } from "react-router";
import { articlesDatabase } from "../data/articles";

export default function Article(): JSX.Element {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articleId ? articlesDatabase[articleId] : undefined;

  if (!article) {
    return (
      <main className="container my-5 py-5 text-center flex-grow-1">
        <div className="fs-1 mb-3">📄</div>
        <h2 className="fw-bold text-success mb-3">Artículo no encontrado</h2>
        <p className="text-muted mb-4">
          El documento clínico que buscas no existe o ha sido removido del
          archivo.
        </p>
        <Link
          to="/blog"
          className="btn btn-outline-success fw-bold rounded-pill px-4"
        >
          Volver al Catálogo Clínico
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5 px-3 px-md-4 flex-grow-1">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb p-3 bg-white rounded-3 shadow-sm flex-nowrap overflow-auto">
          <li className="breadcrumb-item text-nowrap">
            <Link to="/" className="text-success text-decoration-none">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item text-nowrap">
            <Link to="/blog" className="text-success text-decoration-none">
              Artículos Clínicos
            </Link>
          </li>
          <li
            className="breadcrumb-item text-nowrap active text-truncate"
            style={{ maxWidth: "200px" }}
          >
            {article.title}
          </li>
        </ol>
      </nav>

      <article className="bg-white rounded-4 shadow-sm overflow-hidden border">
        <header className="bg-success-subtle p-4 p-md-5 text-center text-md-start border-bottom border-success">
          <div className="row align-items-center">
            <div className="col-lg-10 mx-auto">
              <span
                className={`badge bg-${article.theme} mb-3 px-3 py-2 rounded-pill`}
              >
                {article.badgeText}
              </span>
              <h2 className="fw-bold text-dark mb-4">{article.title}</h2>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                  style={{ width: "40px", height: "40px" }}
                >
                  NV
                </div>
                <div className="text-start">
                  <h6 className="mb-0 fw-bold text-dark">
                    Equipo de Investigación NutriVida
                  </h6>
                  <small className="text-success fw-semibold">
                    {article.date} • {article.readTime} min de lectura
                  </small>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 p-md-5">
          <div className="mx-auto" style={{ maxWidth: "750px" }}>
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className="lh-lg text-dark mb-4"
                style={{ fontSize: "1.05rem", textAlign: "justify" }}
              >
                {paragraph}
              </p>
            ))}

            <hr className="my-5 opacity-25" />

            <div className="bg-light p-4 rounded-4 text-center border">
              <h5 className="fw-bold text-success mb-3">
                ¿Dudas sobre cómo aplicar esto a tu metabolismo?
              </h5>
              <p className="text-muted mb-4 small">
                Nuestros profesionales pueden evaluar tus requerimientos basales
                a través de una sesión biométrica.
              </p>
              <Link
                to="/#contact"
                className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm"
              >
                Agendar Evaluación Clínica
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
