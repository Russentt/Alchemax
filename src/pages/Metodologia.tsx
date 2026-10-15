import React, { useEffect, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import type { Categoria, Servicio } from "../data/types";
import { TiendaService } from "../services/tiendaService";
import { StorageUsuario } from "../services/storageUsuario";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";


export default function Metodologia(): JSX.Element {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");

  useEffect(() => {
    // Cargar categorías creadas
    const catsGuardadas = StorageCategorias.getCategorias();
    if (catsGuardadas && catsGuardadas.length > 0) {
      setCategorias(catsGuardadas);
    }

    // Cargar servicios/productos 
    const srvsGuardados = StorageServicios.getServicios();
    if (srvsGuardados && srvsGuardados.length > 0) {
      // Mostrar servicios activos
      const activos = srvsGuardados.filter(
        (s) => !s.estado || s.estado === "Activo"
      );
      setServicios(activos); 
    } else {
      setServicios([]); 
    }
  }, []);

  const serviciosFiltrados = servicios.filter((servicio) => {
    if (categoriaActiva === "todas") return true;
    return String(servicio.categoriaId) === String(categoriaActiva);
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
              <div className="fs-1" style={{ fontSize: "8rem !important" }}>
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

      <section id="catalogo" className="py-5">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-3">
              Catálogo de Servicios Clínicos
            </h2>
            <p className="text-muted">
              Selecciona el plan sugerido en tu Triage o inicia con una
              evaluación general.
            </p>
          </div>

          {/* Botones de categorías horizontales */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                categoriaActiva === "todas"
                  ? "btn-success text-white shadow-sm"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCategoriaActiva("todas")}
            >
              Todos los Servicios
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  categoriaActiva === cat.id
                    ? "btn-success text-white shadow-sm"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setCategoriaActiva(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div className="row g-4 justify-content-center">
            {serviciosFiltrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="fs-1 text-muted mb-2">🔍</div>
                <h5 className="text-muted fw-semibold">
                  No hay servicios disponibles en esta categoría.
                </h5>
              </div>
            ) : (
              serviciosFiltrados.map((servicio) => (
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
              ))
            )}
          </div>

          <div className="text-center mt-5">
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