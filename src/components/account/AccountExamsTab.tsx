import { type ChangeEvent, type JSX, type RefObject } from "react";
import type { Examen } from "../../types/examen";

interface AccountExamsTabProps {
  examenes: Examen[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onTriggerFileInput: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string, name: string) => void;
}

export default function AccountExamsTab({
  examenes,
  fileInputRef,
  onTriggerFileInput,
  onFileChange,
  onDelete,
}: AccountExamsTabProps): JSX.Element {
  return (
    <div
      className="glass-panel p-4 p-md-5 rounded-5 border-0 mb-5"
      style={{
        minHeight: "55vh",
        animation: "fadeSlideUp 0.4s var(--ease-spring)",
      }}
    >
      <div className="mb-4">
        <h4 className="fw-bolder text-dark mb-1 tracking-tight">
          Repositorio de Exámenes Médicos
        </h4>
        <p className="text-muted small mb-0">
          Carga tus resultados de laboratorio para el análisis previo a tu consulta.
        </p>
      </div>

      <div
        onClick={onTriggerFileInput}
        style={{ cursor: "pointer", borderStyle: "dashed", borderWidth: "2px" }}
        className="p-5 mb-4 bg-white rounded-5 text-center border-success hover-lift transition-all"
      >
        <div className="fs-1 mb-2">📥</div>
        <h5 className="fw-bold text-dark mb-1">
          Haz clic aquí para subir tus exámenes
        </h5>
        <p className="text-muted small mb-3">
          Formatos admitidos: PDF, JPG o PNG (Máximo 5MB por archivo)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="application/pdf, image/jpeg, image/png"
          onChange={onFileChange}
        />
        <span className="btn btn-success rounded-pill px-4 py-2 fw-bold small shadow-sm">
          Seleccionar Documento
        </span>
      </div>

      <h6 className="fw-bolder text-dark text-uppercase tracking-tight small mb-3">
        Historial de Documentos Subidos ({examenes.length})
      </h6>
      {examenes.length === 0 ? (
        <div className="text-center py-4 bg-white rounded-4 border">
          <p className="text-muted small mb-0">
            No hay exámenes cargados en tu ficha clínica.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {examenes.map((examen) => (
            <div
              key={examen.id}
              className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-3 px-4 bg-white border rounded-4 shadow-sm gap-3"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="fs-2">🩺</div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">{examen.nombre}</h6>
                  <small className="text-muted">
                    Cargado el {examen.fechaSubida}
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 align-self-end align-self-sm-center">
                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    examen.estado === "Revisado"
                      ? "bg-success-subtle text-success"
                      : "bg-warning-subtle text-dark"
                  }`}
                >
                  {examen.estado === "Revisado"
                    ? "✓ Revisado por Nutricionista"
                    : "⏳ Pendiente de revisión"}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(examen.id, examen.nombre)}
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  title="Eliminar documento"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
