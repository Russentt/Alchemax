import { type JSX } from "react";
import type { PlanNutricional } from "../../types/planNutricional";

interface AccountPlanTabProps {
  plan: PlanNutricional | null;
  objetivo?: string;
  comidasCompletadas: string[];
  onDownload: () => void;
  onToggleMeal: (mealId: string) => void;
}

export default function AccountPlanTab({
  plan,
  objetivo,
  comidasCompletadas,
  onDownload,
  onToggleMeal,
}: AccountPlanTabProps): JSX.Element {
  if (!plan || !plan.macros) {
    return (
      <div className="glass-panel p-5 rounded-5 text-center">
        <div className="fs-1 mb-3">🥗</div>
        <h5 className="fw-bold text-dark">Aún no tienes una pauta asignada</h5>
        <p className="text-muted small">
          Tu nutricionista cargará tu plan tras tu primera sesión de evaluación.
        </p>
      </div>
    );
  }

  const totalComidas = plan.comidas?.length || 1;
  const progresoDia = Math.round(
    (comidasCompletadas.length / totalComidas) * 100,
  );

  return (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
      style={{
        minHeight: "55vh",
        animation: "fadeSlideUp 0.4s var(--ease-spring)",
      }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold mb-2">
            {plan.caloriasDiarias} kcal diarias • {objetivo || plan.objetivo}
          </span>
          <h4 className="fw-bolder text-dark mb-0 tracking-tight">
            Pauta Alimentaria Activa
          </h4>
        </div>
        <button
          onClick={onDownload}
          className="btn btn-dark rounded-pill px-4 py-2 fw-bold small shadow-sm"
        >
          📥 Descargar Pauta (.TXT)
        </button>
      </div>

      <div className="row g-3 mb-4">
        {plan.macros.map((macro, index) => (
          <div key={index} className="col-md-4">
            <div className="p-3 rounded-4 bg-white border shadow-sm text-center">
              <p className="text-muted small fw-bold text-uppercase tracking-tight mb-1">
                {macro.nombre}
              </p>
              <h4 className="fw-bolder text-dark mb-2">
                {macro.gramos}g{" "}
                <span className="fs-6 text-muted fw-normal">
                  ({macro.porcentaje}%)
                </span>
              </h4>
              <div className="progress rounded-pill" style={{ height: "8px" }}>
                <div
                  className={`progress-bar bg-${macro.color}`}
                  style={{ width: `${macro.porcentaje}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-4 bg-success-subtle border border-success border-opacity-25 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-success small">
            ✅ Tu cumplimiento de hoy ({comidasCompletadas.length} de {" "}
            {totalComidas} comidas)
          </span>
          <span className="fw-bolder text-success small">{progresoDia}%</span>
        </div>
        <div className="progress rounded-pill bg-white" style={{ height: "10px" }}>
          <div
            className="progress-bar bg-success transition-all"
            style={{ width: `${progresoDia}%` }}
          ></div>
        </div>
      </div>

      <h6 className="fw-bolder text-dark text-uppercase tracking-tight small mb-3">
        Estructura Diaria (Marca tus comidas realizadas)
      </h6>
      <div className="d-flex flex-column gap-3">
        {plan.comidas.map((comida) => {
          const completada = comidasCompletadas.includes(comida.id);
          return (
            <div
              key={comida.id}
              onClick={() => onToggleMeal(comida.id)}
              style={{ cursor: "pointer" }}
              className={`p-4 rounded-4 border transition-all d-flex align-items-start gap-3 ${
                completada
                  ? "bg-success-subtle border-success"
                  : "bg-white hover-lift"
              }`}
            >
              <input
                type="checkbox"
                className="form-check-input mt-1"
                checked={completada}
                onChange={() => {}}
                style={{ width: "1.3rem", height: "1.3rem", cursor: "pointer" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-2">
                  <span
                    className={`fw-bolder fs-6 ${
                      completada
                        ? "text-decoration-line-through text-success"
                        : "text-dark"
                    }`}
                  >
                    {comida.tipo}
                  </span>
                  <span className="badge bg-light text-dark border rounded-pill px-3 py-1">
                    🕒 {comida.horario}
                  </span>
                </div>
                <p
                  className={`small mb-0 ${
                    completada ? "text-muted" : "text-secondary"
                  }`}
                >
                  {comida.descripcion}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
