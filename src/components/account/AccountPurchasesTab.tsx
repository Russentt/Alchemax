import { type JSX } from "react";
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
            Administra tus prestaciones contratadas y agenda tus sesiones correspondientes.
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
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="p-4 rounded-4 bg-white border shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 hover-lift"
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h5 className="fw-bolder text-dark mb-0">{compra.nombre}</h5>
                  <span
                    className={`badge rounded-pill px-3 ${
                      compra.estado === "Activo" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {compra.estado}
                  </span>
                </div>
                <p className="text-muted small mb-0">
                  Adquirido el <strong>{compra.fechaCompra}</strong> • Monto pagado:{" "}
                  <strong className="text-success">
                    {formatPriceCLP(compra.monto)}
                  </strong>
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => onBookAppointment(compra.nombre)}
                  className="btn btn-dark rounded-pill px-4 py-2 fw-bold small shadow-sm"
                >
                  📅 Agendar Hora de este Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
