import { useEffect, useState, type JSX } from "react";
import type { Servicio } from "../types/index";
import { formatPriceCLP } from "../utils/formatPriceCLP";

interface ServiceDetailModalProps {
  servicio: Servicio | null;
  onClose: () => void;
  onAddToCart: (servicio: Servicio, cantidad: number) => Promise<void> | void;
  onBuyNow?: (servicio: Servicio, cantidad: number) => Promise<void> | void;
  isPatientOrGuest: boolean;
}

const getBeneficiosPorTipo = (tipo?: string): string[] => {
  const normalizado = (tipo || "").toLowerCase();
  if (normalizado.includes("evaluacion")) {
    return [
      "Evaluación clínica personalizada con nutricionista acreditada.",
      "Análisis de composición corporal e informe metabólico digital.",
      "Acceso inmediato al Portal del Paciente para agendar tu horario.",
    ];
  }
  if (normalizado.includes("control")) {
    return [
      "Revisión de evolución biométrica y ajuste fino de pauta alimentaria.",
      "Atención ágil por videollamada o modalidad clínica según disponibilidad.",
      "Actualización de recomendaciones y registro en tu historial.",
    ];
  }
  return [
    "Pauta alimentaria 100% personalizada según objetivos y exámenes clínicos.",
    "Acceso completo al Portal del Paciente (pauta, biometría e historial).",
    "Seguimiento estructurado con especialistas de Clínica NutriVida.",
  ];
};

export default function ServiceDetailModal({
  servicio,
  onClose,
  onAddToCart,
  onBuyNow,
  isPatientOrGuest,
}: ServiceDetailModalProps): JSX.Element | null {
  const [cantidad, setCantidad] = useState<number>(1);
  const [procesando, setProcesando] = useState<boolean>(false);

  useEffect(() => {
    if (!servicio) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !procesando) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [servicio, procesando, onClose]);

  if (!servicio) return null;

  const subtotal = servicio.precio * cantidad;
  const beneficios = getBeneficiosPorTipo(servicio.tipo);

  const handleConfirmAdd = async () => {
    setProcesando(true);
    try {
      await onAddToCart(servicio, cantidad);
      onClose();
    } finally {
      setProcesando(false);
    }
  };

  const handleConfirmBuyNow = async () => {
    if (!onBuyNow) return;
    setProcesando(true);
    try {
      await onBuyNow(servicio, cantidad);
      onClose();
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
      style={{
        zIndex: 1085,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="serviceDetailModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget && !procesando) {
          onClose();
        }
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-5 overflow-hidden w-100 my-auto"
        style={{ maxWidth: "580px", animation: "fadeSlideUp 0.25s ease-out" }}
      >
        <div
          className="px-4 py-4 d-flex justify-content-between align-items-start gap-3"
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 60%, #ffffff 100%)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-4 bg-white shadow-sm d-flex align-items-center justify-content-center fs-1 flex-shrink-0"
              style={{ width: "64px", height: "64px" }}
              aria-hidden="true"
            >
              {servicio.icono || "🥗"}
            </div>
            <div>
              <div className="d-flex flex-wrap gap-2 mb-1">
                <span className="badge bg-dark text-white rounded-pill text-uppercase px-3 py-1" style={{ fontSize: "0.68rem" }}>
                  {servicio.tipo}
                </span>
                {servicio.categoriaNombre && (
                  <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1" style={{ fontSize: "0.7rem" }}>
                    {servicio.categoriaNombre}
                  </span>
                )}
              </div>
              <h4 id="serviceDetailModalTitle" className="fw-bolder text-dark mb-0 tracking-tight">
                {servicio.nombre}
              </h4>
            </div>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={procesando}
            aria-label="Cerrar detalle del servicio"
          />
        </div>

        <div className="card-body p-4">
          <p className="text-secondary lh-lg mb-4">{servicio.descripcion}</p>

          <div className="p-3 rounded-4 bg-light border mb-4">
            <h6 className="fw-bold text-dark small text-uppercase mb-2 tracking-tight">
              ¿Qué incluye esta prestación?
            </h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small text-muted">
              {beneficios.map((item, idx) => (
                <li key={idx} className="d-flex align-items-start gap-2">
                  <span className="text-success fw-bold" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 p-3 rounded-4 border bg-white mb-4">
            <div>
              <span className="text-muted small d-block">Valor por sesión / plan</span>
              <span className="fw-bolder text-success fs-4">
                {formatPriceCLP(servicio.precio)}
              </span>
            </div>

            {isPatientOrGuest && (
              <div className="d-flex align-items-center gap-3">
                <span className="small fw-semibold text-secondary">Cantidad:</span>
                <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-dark text-decoration-none fw-bold px-2 py-0"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    disabled={cantidad <= 1 || procesando}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span
                    className="fw-bold font-monospace px-2 text-center"
                    style={{ minWidth: "2rem" }}
                    aria-live="polite"
                  >
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-dark text-decoration-none fw-bold px-2 py-0"
                    onClick={() => setCantidad((c) => Math.min(10, c + 1))}
                    disabled={cantidad >= 10 || procesando}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {isPatientOrGuest ? (
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={procesando}
                className="btn btn-outline-dark rounded-pill fw-bold py-2 px-4 flex-grow-1"
              >
                {procesando ? "Agregando..." : `🛒 Añadir al carrito (${formatPriceCLP(subtotal)})`}
              </button>
              {onBuyNow && (
                <button
                  type="button"
                  onClick={handleConfirmBuyNow}
                  disabled={procesando}
                  className="btn btn-success rounded-pill fw-bold py-2 px-4 flex-grow-1 shadow-sm"
                >
                  💳 Ir al carrito y pagar
                </button>
              )}
            </div>
          ) : (
            <div className="alert alert-warning mb-0 small rounded-4 border-0">
              La contratación de prestaciones está habilitada únicamente para cuentas de paciente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
