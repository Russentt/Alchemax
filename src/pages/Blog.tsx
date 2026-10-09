import React, { type JSX } from "react";
import { Link } from "react-router";
import ArticleCard from "../components/ArticleCard";

export default function Blog(): JSX.Element {
  return (
    <main className="container my-5 px-3 px-md-4 flex-grow-1">
      {/* Breadcrumb */}
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
          Artículos redactados por nuestro equipo clínico en Temuco para
          desmitificar la nutrición y guiarte hacia un estilo de vida basado en
          ciencia.
        </p>
      </div>

      {/* Featured Article - Now correctly wired to the dynamic article route */}
      <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden bg-white">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 bg-success text-white p-5 d-flex flex-column justify-content-center min-vh-25">
            <span className="badge bg-light text-success align-self-start mb-3 px-3 py-2 rounded-pill">
              Artículo Destacado
            </span>
            <h2 className="fw-bold display-6 mb-3">
              Impacto de los probióticos en la absorción intestinal y
              resistencia a la insulina
            </h2>
            <p className="opacity-75 mb-0">
              Una revisión de 12 semanas analizando la cepa Lactobacillus
              reuteri y su modulación directa sobre el metabolismo de la glucosa
              en pacientes de La Araucanía.
            </p>
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
                    Actualizado hace 2 días • 6 min de lectura
                  </small>
                </div>
              </div>
              <p className="text-muted lh-lg mb-4">
                La microbiota intestinal no solo regula la digestión; actúa como
                un órgano endocrino secundario. Descubre cómo la selección
                adecuada de cepas bacterianas optimiza la permeabilidad
                intestinal y reduce la inflamación sistémica de bajo grado.
              </p>
            </div>

            {/* Critical Fix: Link targets the JSON key in your data layer */}
            <Link
              to="/blog/probioticos-insulina"
              className="btn btn-outline-success fw-bold align-self-start mt-3"
            >
              Leer investigación completa
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Grid mapped to the remaining articles */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        <ArticleCard
          theme="success"
          badgeText="Metabolismo"
          title="¿Por qué el déficit calórico extremo arruina tu metabolismo basal?"
          description="Analizamos la termogénesis adaptativa y cómo el cuerpo reduce el gasto energético espontáneo (NEAT) cuando restringimos calorías de forma agresiva sin supervisión clínica."
          readTime={4}
          linkTo="/blog/termogenesis-adaptativa"
        />

        <ArticleCard
          theme="info"
          badgeText="Deporte y Rendimiento"
          title="Creatina monohidratada: más allá del rendimiento muscular"
          description="Nuevos metaanálisis demuestran beneficios cognitivos, neuroprotectores y de modulación glucémica en adultos que no necesariamente realizan alta competición deportiva."
          readTime={5}
          linkTo="/blog/creatina-neuroproteccion"
        />

        <ArticleCard
          theme="warning"
          badgeText="Nutrición Basada en Plantas"
          title="Planificación segura de dietas vegetarianas en invierno"
          description="Estrategias clave para asegurar la biodisponibilidad de Hierro no hemo, Zinc y Vitamina B12 durante los meses de menor exposición solar en el sur de Chile."
          readTime={7}
          linkTo="/blog/dieta-vegetariana-invierno"
        />
      </div>

      {/* Newsletter Section */}
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
