import { useState, type JSX } from "react";
import { Link } from "react-router";
import type { Compra } from "../../types/compra";
import { formatPriceCLP } from "../../utils/formatPriceCLP";

interface AccountPurchasesTabProps {
  compras: Compra[];
  onBookAppointment: (serviceName: string) => void;
}

export default function AccountPurchasesTab({
  compras,
  onBookAppointment,
}: AccountPurchasesTabProps): JSX.Element {
  const [detalleAbiertoId, setDetalleAbiertoId] = useState<number | null>(null);

  const toggleDetalle = (id: number) => {
    setDetalleAbiertoId((prev) => (prev === id ? null : id));
  };

  const getBadgeClass = (estado: Compra["estado"]) => {
    if (estado === "Activo") return "bg-success";
    if (estado === "Completado") return "bg-primary";
    return "bg-danger";
  };

  return (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
      style={{
        minHeight: "55vh",
        animation: "fadeSlideUp 0.4s var(--ease-spring)",
      }}
    >
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">
            Mis Planes y Servicios Adquiridos
          </h4>
          <p className="text-muted small mb-0">
            Consulta el historial de tus operaciones, revisa el detalle de cada prestación y agenda tus sesiones.
          </p>
        </div>
        <Link
          to="/metodologia#catalogo"
          className="btn-kinetic-secondary py-2 px-4 text-decoration-none"
        >
          Explorar Catálogo →
        </Link>
      </div>

      {compras.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-5 border">
          <div className="fs-1 mb-3">🛍️</div>
          <h5 className="fw-bold text-dark mb-2">
            Aún no tienes servicios contratados
          </h5>
          <p className="text-muted small mb-4">
            Explora nuestro catálogo clínico para adquirir tu evaluación o plan nutricional.
          </p>
          <Link
            to="/metodologia#catalogo"
            className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm"
          >
            Ir al Catálogo Clínico
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {compras.map((compra) => {
            const codigoOperacion = `#CMP-${String(compra.id).padStart(4, "0")}`;
            const estaExpandido = detalleAbiertoId === compra.id;

            return (
              <div
                key={compra.id}
                className="p-4 rounded-4 bg-white border shadow-sm hover-lift"
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <span className="badge bg-dark-subtle text-dark font-monospace rounded-pill px-3 py-1">
                        {codigoOperacion}
                      </span>
                      <h5 className="fw-bolder text-dark mb-0">{compra.nombre}</h5>
                      <span
                        className={`badge rounded-pill px-3 ${getBadgeClass(compra.estado)}`}
                      >
                        {compra.estado}
                      </span>
                    </div>
                    <p className="text-muted small mb-0">
                      Fecha de operación: <strong>{compra.fechaCompra}</strong> • Monto total:{" "}
                      <strong className="text-success">
                        {formatPriceCLP(compra.monto)}
                      </strong>
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDetalle(compra.id)}
                      aria-expanded={estaExpandido}
                      className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold small"
                    >
                      {estaExpandido ? "Ocultar detalle" : "🔍 Ver detalle"}
                    </button>
                    {compra.estado !== "Cancelado" && (
                      <button
                        type="button"
                        onClick={() => onBookAppointment(compra.nombre)}
                        className="btn btn-dark rounded-pill px-4 py-2 fw-bold small shadow-sm"
                      >
                        📅 Agendar Hora de este Plan
                      </button>
                    )}
                  </div>
                </div>

                {estaExpandido && (
                  <div
                    className="mt-3 pt-3 border-top small text-secondary"
                    aria-label={`Detalle de operación ${codigoOperacion}`}
                  >
                    <div className="row g-3">
                      <div className="col-6 col-md-3">
                        <span className="d-block text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                          ID de Operación
                        </span>
                        <span className="font-monospace text-dark fw-semibold">
                          {codigoOperacion}
                        </span>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="d-block text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                          Código de Servicio
                        </span>
                        <span className="font-monospace text-dark fw-semibold">
                          SRV-{String(compra.servicio || compra.id).padStart(3, "0")}
                        </span>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="d-block text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                          Estado de Prestación
                        </span>
                        <span className="text-dark fw-semibold">{compra.estado}</span>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="d-block text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                          Total Facturado (CLP)
                        </span>
                        <span className="text-success fw-bold">
                          {formatPriceCLP(compra.monto)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
