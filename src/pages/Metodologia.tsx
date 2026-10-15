import React, { useEffect, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import type { Categoria, Servicio } from "../data/types";
import { TiendaService } from "../services/tiendaService";
import { StorageUsuario } from "../services/storageUsuario";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";

const catalogoServiciosPorDefecto: Servicio[] = [
  {
    id: "srv-01",
    nombre: "Evaluación Biométrica Inicial",
    descripcion: "Análisis InBody, revisión de exámenes y diagnóstico metabólico presencial.",
    precio: 35000,
    tipo: "evaluacion",
    icono: "⚖️",
    categoriaId: "cat-01",
    estado: "Activo",
  },
  {
    id: "srv-02",
    nombre: "Plan Nutricional Deportivo",
    descripcion: "Pauta estructurada para recomposición corporal y rendimiento físico. Incluye 2 controles.",
    precio: 120000,
    tipo: "plan",
    icono: "🏋️",
    categoriaId: "cat-02",
    estado: "Activo",
  },
  {
    id: "srv-03",
    nombre: "Control Telemedicina",
    descripcion: "Ajuste de pauta y seguimiento de progreso mediante videollamada de 30 minutos.",
    precio: 25000,
    tipo: "control",
    icono: "💻",
    categoriaId: "cat-03",
    estado: "Activo",
  },
];

export default function Metodologia(): JSX.Element {
  const navigate = useNavigate();

  // Estados de servicios y categorías cargados de Storage
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("todas");

  useEffect(() => {
    //  Obtener categorías desde db_categorias
    const catsGuardadas = StorageCategorias.getCategorias();
    setCategorias(catsGuardadas || []);

    //  Obtener servicios desde db_servicios o catálogo por defecto
    const srvsGuardados = StorageServicios.getServicios();
    if (srvsGuardados && srvsGuardados.length > 0) {
      setServicios(srvsGuardados.filter((s) => s.estado === "Activo"));
    } else {
      setServicios(catalogoServiciosPorDefecto);
    }
  }, []);

  // Filtrado según la categoría elegida en el menú desplegable
  const serviciosFiltrados = servicios.filter((servicio) => {
    if (categoriaSeleccionada === "todas") return true;
    return servicio.categoriaId === categoriaSeleccionada;
  });

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

  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");

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
    let diagnostico = "";
    let color = "";
    let recomendacion = "";

    if (imc < 18.5) {
      diagnostico = "Bajo Peso";
      color = "warning";
      recomendacion =
        "Sugerimos un Plan Clínico enfocado en superávit calórico controlado y ganancia de masa magra.";
    } else if (imc >= 18.5 && imc <= 24.9) {
      diagnostico = "Normopeso";
      color = "success";
      recomendacion =
        triageForm.objetivo === "rendimiento"
          ? "Estás en un rango óptimo. Te sugerimos el Plan Nutricional Deportivo para potenciar tu rendimiento."
          : "Estás en un rango óptimo. Una Evaluación Biométrica Inicial nos ayudará a afinar tus hábitos actuales.";
    } else if (imc >= 25 && imc <= 29.9) {
      diagnostico = "Sobrepeso";
      color = "warning";
      recomendacion =
        "Sugerimos una Evaluación Biométrica Inicial para diseñar un déficit calórico que proteja tu masa muscular.";
    } else {
      diagnostico = "Obesidad";
      color = "danger";
      recomendacion =
        "Te recomendamos encarecidamente nuestro Plan Nutricional Clínico para un abordaje metabólico integral.";
    }

    setTriageResult({ imc, diagnostico, color, recomendacion });
  };

  const handleAddToCart = (servicio: Servicio) => {
    const sesionActual = StorageUsuario.getUsuarioSesion();

    if (!sesionActual) {
      setNotification({
        message: "Debes iniciar sesión para agregar servicios al carrito.",
        type: "warning",
      });

      setTimeout(() => {
        setNotification(null);
        navigate("/login");
      }, 2500);
      return;
    }


    TiendaService.agregarAlCarrito(servicio);

    setNotification({
      message: `¡"${servicio.nombre}" se ha añadido a tu carrito correctamente! Puedes ir a pagar para asignarlo a tu cuenta.`,
      type: "success",
    });

    setTimeout(() => {
      setNotification(null);
    }, 15000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const serviciosFiltrados = catalogoServicios.filter((servicio) => {
    if (filtroCategoria === "todos") return true;
    return servicio.tipo === filtroCategoria;
  });

  const chunkArray = (arr: Servicio[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const carruselChunks = chunkArray(serviciosFiltrados, 4);

  return (
    <main className="flex-grow-1 bg-light position-relative">
      {notification && (
        <div
          className="position-fixed top-0 end-0 p-4 animation-fade-in"
          style={{ zIndex: 1100, marginTop: "80px" }}
        >
          <div
            className={`toast show align-items-center text-white bg-${notification.type} border-0 shadow-lg rounded-4 p-2`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold px-3 py-2 fs-6">
                🛒 {notification.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-3 m-auto"
                onClick={() => setNotification(null)}
                aria-label="Close"
              ></button>
            </div>
            {notification.type === "success" && (
              <div className="px-3 pb-2 text-end">
                <Link
                  to="/carrito"
                  className="btn btn-light btn-sm fw-bold text-success rounded-pill px-3 shadow-sm"
                >
                  Ir al carrito ahora
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="bg-success text-white py-5">
        <div className="container py-4 px-4 px-md-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-white text-success mb-3 px-3 py-2 rounded-pill">
                Nuestro Enfoque
              </span>
              <h1 className="display-5 fw-bold mb-4">
                Ciencia, no restricciones.
              </h1>
              <p className="lead opacity-75 mb-4">
                En NutriVida rechazamos las dietas genéricas. Utilizamos
                tecnología InBody y evidencia clínica actualizada para diseñar
                pautas metabólicas que se adaptan a tu estilo de vida, no al
                revés.
              </p>
            </div>
            <div className="col-lg-5 offset-lg-1 d-none d-lg-block text-center">
              <div className="fs-1" style={{ fontSize: "8rem" }}>
                🧬
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white border-bottom">
        <div className="container px-4 px-md-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center mb-5">
              <h2 className="fw-bold text-dark mb-3">
                Calculadora de Triage Clínico
              </h2>
              <p className="text-muted">
                Ingresa tus datos biométricos básicos. Nuestro algoritmo
                calculará tu Índice de Masa Corporal (IMC) y te sugerirá el
                servicio más adecuado para tu punto de partida.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="bg-light p-4 p-md-5 rounded-4 shadow-sm border border-success border-opacity-25">
                <div className="row g-5 align-items-center">
                  <div className="col-md-6 border-md-end border-success border-opacity-25 pe-md-5">
                    <form onSubmit={handleTriageSubmit}>
                      <div className="mb-3">
                        <label className="form-label text-muted fw-semibold small">
                          Peso actual (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="peso"
                          className="form-control form-control-lg"
                          placeholder="Ej: 70.5"
                          value={triageForm.peso}
                          onChange={handleTriageChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted fw-semibold small">
                          Estatura (cm)
                        </label>
                        <input
                          type="number"
                          name="altura"
                          className="form-control form-control-lg"
                          placeholder="Ej: 171"
                          value={triageForm.altura}
                          onChange={handleTriageChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-muted fw-semibold small">
                          Objetivo Principal
                        </label>
                        <select
                          name="objetivo"
                          className="form-select form-select-lg"
                          value={triageForm.objetivo}
                          onChange={handleTriageChange}
                        >
                          <option value="bajar">
                            Reducción de porcentaje de grasa
                          </option>
                          <option value="mantener">
                            Mantenimiento y reeducación alimentaria
                          </option>
                          <option value="rendimiento">
                            Aumento de masa muscular / Rendimiento
                          </option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
                      >
                        Evaluar mi perfil
                      </button>
                    </form>
                  </div>

                  <div className="col-md-6 ps-md-5 text-center text-md-start">
                    {!triageResult ? (
                      <div className="text-muted d-flex flex-column align-items-center justify-content-center h-100 opacity-50">
                        <div className="fs-1 mb-3">🩺</div>
                        <p>
                          Completa el formulario para visualizar tu diagnóstico
                          preventivo.
                        </p>
                      </div>
                    ) : (
                      <div className="animation-fade-in">
                        <h5 className="text-muted fw-semibold mb-1">
                          Tu Resultado Biométrico
                        </h5>
                        <div className="d-flex align-items-end justify-content-center justify-content-md-start gap-3 mb-3">
                          <h1 className="display-4 fw-bold text-dark mb-0">
                            {triageResult.imc}
                          </h1>
                          <span
                            className={`badge bg-${triageResult.color} fs-6 mb-2 rounded-pill`}
                          >
                            {triageResult.diagnostico}
                          </span>
                        </div>
                        <div
                          className={`alert alert-${triageResult.color} bg-${triageResult.color}-subtle border-0 rounded-3 mb-0`}
                          role="alert"
                        >
                          <p className="mb-0 text-dark fw-semibold small lh-lg">
                            {triageResult.recomendacion}
                          </p>
                        </div>
                        <a
                          href="#catalogo"
                          className="btn btn-outline-dark btn-sm mt-4 fw-bold rounded-pill px-4"
                        >
                          Ver servicios recomendados ↓
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO CON MENÚ DESPLEGABLE DE CATEGORÍAS */}
      <section id="catalogo" className="py-5">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-3">
              Catálogo de Servicios Clínicos
            </h2>
            <p className="text-muted">
              Selecciona el plan sugerido en tu Triage o inicia con una evaluación general.
            </p>
          </div>

          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
            <button
              onClick={() => setFiltroCategoria("todos")}
              className={`btn rounded-pill px-4 fw-semibold ${filtroCategoria === "todos" ? "btn-success" : "btn-outline-success"}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroCategoria("evaluacion")}
              className={`btn rounded-pill px-4 fw-semibold ${filtroCategoria === "evaluacion" ? "btn-success" : "btn-outline-success"}`}
            >
              Evaluaciones
            </button>
            <button
              onClick={() => setFiltroCategoria("plan")}
              className={`btn rounded-pill px-4 fw-semibold ${filtroCategoria === "plan" ? "btn-success" : "btn-outline-success"}`}
            >
              Planes Nutricionales
            </button>
            <button
              onClick={() => setFiltroCategoria("control")}
              className={`btn rounded-pill px-4 fw-semibold ${filtroCategoria === "control" ? "btn-success" : "btn-outline-success"}`}
            >
              Controles
            </button>
            <button
              onClick={() => setFiltroCategoria("asesoria")}
              className={`btn rounded-pill px-4 fw-semibold ${filtroCategoria === "asesoria" ? "btn-success" : "btn-outline-success"}`}
            >
              Asesorías
            </button>
          </div>

          <div id="carruselServicios" className="carousel slide pb-5" data-bs-ride="false">
            <div className="carousel-inner px-2 py-3">
              {carruselChunks.length > 0 ? (
                carruselChunks.map((chunk, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <div className="row g-4 justify-content-center">
                      {chunk.map((servicio) => (
                        <div key={servicio.id} className="col-12 col-md-6 col-lg-3">
                          <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
                            <div className="card-body p-4 d-flex flex-column">
                              <div className="fs-1 mb-3">{servicio.icono}</div>
                              <span
                                className="badge bg-light text-secondary border align-self-start mb-3 rounded-pill text-uppercase"
                                style={{ fontSize: "0.65rem" }}
                              >
                                {servicio.tipo}
                              </span>
                              <h5 className="fw-bold text-dark mb-3">
                                {servicio.nombre}
                              </h5>
                              <p className="text-muted small mb-4 flex-grow-1">
                                {servicio.descripcion}
                              </p>
                              <div>
                                <h4 className="fw-bold text-success mb-3">
                                  {formatPrice(servicio.precio)}
                                </h4>
                                <button
                                  onClick={() => handleAddToCart(servicio)}
                                  className="btn btn-outline-success w-100 fw-bold rounded-pill"
                                >
                                  Agregar al Carrito
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5">
                  <p>No hay servicios disponibles en esta categoría.</p>
                </div>
              )}
            </div>

            {carruselChunks.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carruselServicios"
                  data-bs-slide="prev"
                  style={{ width: "5%", filter: "invert(100%)" }}
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carruselServicios"
                  data-bs-slide="next"
                  style={{ width: "5%", filter: "invert(100%)" }}
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
                <div className="carousel-indicators" style={{ bottom: "-20px", filter: "invert(100%)" }}>
                  {carruselChunks.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#carruselServicios"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0 ? "true" : "false"}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-4">
            <Link
              to="/carrito"
              className="btn btn-dark btn-lg fw-bold px-5 rounded-pill shadow-sm"
            >
              Ir a pagar servicios
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .animation-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.15)!important;
        }
      `}</style>
    </main>
  );
}