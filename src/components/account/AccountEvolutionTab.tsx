import { type FormEvent, type JSX } from "react";
import type { Metrica } from "../../types/metrica";

export interface MetricForm {
  peso: string;
  grasa: string;
  musculo: string;
}

interface AccountEvolutionTabProps {
  metricas: Metrica[];
  isAddingMetrica: boolean;
  nuevaMetrica: MetricForm;
  onToggleForm: () => void;
  onFieldChange: (field: keyof MetricForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AccountEvolutionTab({
  metricas,
  isAddingMetrica,
  nuevaMetrica,
  onToggleForm,
  onFieldChange,
  onSubmit,
}: AccountEvolutionTabProps): JSX.Element {
  const pesoDiferencia =
    metricas.length >= 2
      ? (metricas[0].peso - metricas[metricas.length - 1].peso).toFixed(1)
      : "0.0";

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
            Evolución y Biometría
          </h4>
          <p className="text-muted small mb-0">
            Monitorea tus cambios de composición corporal a lo largo del tratamiento.
          </p>
        </div>
        <button
          onClick={onToggleForm}
          className="btn-kinetic-health py-2 px-4 border-0 shadow-sm"
        >
          {isAddingMetrica ? "Cancelar" : "+ Registrar Control"}
        </button>
      </div>

      {isAddingMetrica && (
        <form onSubmit={onSubmit} className="p-4 rounded-4 bg-white border shadow-sm mb-4">
          <h6 className="fw-bold text-dark mb-3">
            Nuevo Registro de Control Corporal
          </h6>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-control apple-input"
                placeholder="Ej: 69.5"
                value={nuevaMetrica.peso}
                onChange={(event) => onFieldChange("peso", event.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">
                % Grasa Corporal
              </label>
              <input
                type="number"
                step="0.1"
                className="form-control apple-input"
                placeholder="Ej: 21.5"
                value={nuevaMetrica.grasa}
                onChange={(event) => onFieldChange("grasa", event.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">
                Masa Muscular (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-control apple-input"
                placeholder="Ej: 30.2"
                value={nuevaMetrica.musculo}
                onChange={(event) => onFieldChange("musculo", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-success rounded-pill px-4 py-2 fw-bold small">
              Guardar Medición
            </button>
          </div>
        </form>
      )}

      {metricas.length === 0 ? (
        <div className="text-center py-5">
          <div className="fs-1 mb-2">📊</div>
          <p className="text-muted">Aún no existen mediciones registradas.</p>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="p-4 rounded-4 bg-success text-white shadow-sm">
                <p className="small mb-1 opacity-75 fw-semibold text-uppercase">
                  Variación Total
                </p>
                <h3 className="fw-bolder mb-0">
                  {parseFloat(pesoDiferencia) > 0
                    ? `+${pesoDiferencia}`
                    : pesoDiferencia}{" "}
                  kg
                </h3>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-4 rounded-4 bg-white border shadow-sm">
                <p className="small text-muted fw-semibold mb-1 text-uppercase">
                  % Grasa Actual
                </p>
                <h3 className="fw-bolder text-dark mb-0">{metricas[0].grasa}%</h3>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-4 rounded-4 bg-white border shadow-sm">
                <p className="small text-muted fw-semibold mb-1 text-uppercase">
                  Masa Muscular
                </p>
                <h3 className="fw-bolder text-success mb-0">
                  {metricas[0].musculo} kg
                </h3>
              </div>
            </div>
          </div>

          <div className="table-responsive rounded-4 border bg-white shadow-sm overflow-hidden">
            <table className="table table-hover align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 text-uppercase small text-muted">Fecha de Control</th>
                  <th className="py-3 text-uppercase small text-muted">Peso (kg)</th>
                  <th className="py-3 text-uppercase small text-muted">% Grasa Corporal</th>
                  <th className="py-3 text-uppercase small text-muted">Masa Muscular (kg)</th>
                </tr>
              </thead>
              <tbody>
                {metricas.map((metrica) => (
                  <tr key={metrica.id}>
                    <td className="py-3 fw-bold text-dark">{metrica.fecha}</td>
                    <td className="py-3 fw-semibold">{metrica.peso} kg</td>
                    <td className="py-3">
                      <span className="badge bg-light text-dark border rounded-pill px-3">
                        {metrica.grasa}%
                      </span>
                    </td>
                    <td className="py-3 text-success fw-bold">{metrica.musculo} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
