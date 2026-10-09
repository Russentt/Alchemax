import { Link } from "react-router";

export default function Metodologia() {
  return (
    <>
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="2"
          ></button>
        </div>
        <div className="carousel-inner">
          <div
            className="carousel-item active bg-success"
            style={{ minHeight: "60vh" }}
          >
            <div className="d-flex h-100 py-5 align-items-center justify-content-center text-center text-white px-3 px-md-5">
              <div style={{ maxWidth: "800px" }} className="py-5">
                <span className="badge bg-light text-success mb-3 px-3 py-2 rounded-pill text-wrap">
                  Nutrición Basada en Evidencia
                </span>
                <h1 className="display-5 fw-bold mb-4">
                  Ciencia Aplicada a tu Metabolismo
                </h1>
                <p className="lead fs-5 px-2">
                  En NutriVida no creemos en las dietas de moda. Implementamos
                  un enfoque clínico riguroso, analizando tu composición
                  corporal, tu entorno psicosocial y tus objetivos fisiológicos
                  para diseñar un plan irrepetible.
                </p>
              </div>
            </div>
          </div>
          {/* Skipping remaining carousel items */}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <main className="container my-5 px-3 px-md-4">
        <nav aria-label="breadcrumb" className="mb-5">
          <ol className="breadcrumb p-3 bg-white rounded-3 shadow-sm flex-nowrap overflow-auto">
            <li className="breadcrumb-item text-nowrap">
              <Link to="/" className="text-success text-decoration-none">
                Inicio
              </Link>
            </li>
            <li className="breadcrumb-item text-nowrap active">
              Metodologia y Planes
            </li>
          </ol>
        </nav>

        <section id="servicios" className="mb-5 pt-3">
          <div className="text-center mb-4 px-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold mb-2">
              Catálogo Oficial NutriVida
            </span>
            <h2 className="display-5 fw-bold text-dark mb-2">
              Servicios y Planes Clínicos
            </h2>
            <p className="text-muted fs-5">
              Encuentra y filtra el tratamiento nutricional ideal según tus
              objetivos de salud.
            </p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-5">
                <label
                  htmlFor="filtroCategoria"
                  className="form-label fw-bold text-dark small mb-1"
                >
                  Filtrar por Categoría:
                </label>
                <select
                  id="filtroCategoria"
                  className="form-select border-secondary-subtle py-2"
                >
                  <option value="todos">Todas las categorías</option>
                  <option value="Consulta">Consultas Clínicas</option>
                  <option value="Plan especializado">
                    Planes Especializados
                  </option>
                  <option value="Evaluación">Evaluaciones Biométricas</option>
                  <option value="Taller grupal">Talleres Grupales</option>
                </select>
              </div>
              <div className="col-12 col-md-5">
                <label
                  htmlFor="filtroPrecio"
                  className="form-label fw-bold text-dark small mb-1"
                >
                  Precio máximo:{" "}
                  <span id="labelPrecio" className="text-success fw-bold">
                    $170.000
                  </span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="filtroPrecio"
                  min="10000"
                  max="170000"
                  step="5000"
                  defaultValue="170000"
                />
              </div>
              <div className="col-12 col-md-2 d-flex align-items-end">
                <button
                  id="btnLimpiarFiltros"
                  className="btn btn-outline-secondary w-100 py-2"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </div>

          <div
            className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
            id="contenedorCatalogo"
          >
            {/* React will map over product data here to generate catalog items */}
          </div>
        </section>

        {/* Triage Calculator Section */}
        <section className="bg-success text-white p-4 p-md-5 rounded-4 shadow-lg mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 text-center text-lg-start">
              <h2 className="fw-bold mb-3">Calculadora de Triage Clínico</h2>
              <p className="lead mb-0 fs-6 fs-md-5">
                Ingresa tus datos corporales básicos y nuestro sistema generará
                un pre-diagnóstico de tu estado actual para recomendarte el
                especialista adecuado.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="bg-white p-4 p-md-5 rounded-4 shadow">
                <form id="imcForm">
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control border-secondary-subtle"
                      id="floatingName"
                      placeholder="Tu nombre"
                      required
                    />
                    <label htmlFor="floatingName" className="text-muted">
                      Nombre de pila
                    </label>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-success fw-bold small mb-1">
                        Estatura
                      </label>
                      <div className="input-group flex-nowrap shadow-sm">
                        <span className="input-group-text bg-light border-end-0 border-secondary-subtle">
                          📏
                        </span>
                        <input
                          type="number"
                          className="form-control border-start-0 border-secondary-subtle"
                          id="alturaInput"
                          required
                        />
                        <span className="input-group-text bg-light border-secondary-subtle">
                          cm
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-success fw-bold small mb-1">
                        Peso Actual
                      </label>
                      <div className="input-group flex-nowrap shadow-sm">
                        <span className="input-group-text bg-light border-end-0 border-secondary-subtle">
                          ⚖️
                        </span>
                        <input
                          type="number"
                          className="form-control border-start-0 border-secondary-subtle"
                          id="pesoInput"
                          step="0.1"
                          required
                        />
                        <span className="input-group-text bg-light border-secondary-subtle">
                          kg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-success fw-bold small mb-1">
                      Objetivo
                    </label>
                    <select
                      className="form-select shadow-sm border-secondary-subtle py-2"
                      required
                      defaultValue=""
                    >
                      <option disabled value="">
                        Selecciona una opción...
                      </option>
                      <option value="1">Bajar grasa corporal</option>
                      <option value="2">Subir masa muscular</option>
                      <option value="3">Mejorar rendimiento</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-success w-100 fw-bold py-3 fs-5 shadow-sm mt-2"
                    data-bs-toggle="modal"
                    data-bs-target="#imcModal"
                  >
                    Generar Pre-Diagnóstico
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
