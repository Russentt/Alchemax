import { type JSX } from "react";

export type nutriTab =
  | "dashboard"
  | "users"
  | "clinical"
  | "products"
  | "categories";

interface NutricionistaSidebarProps {
  activeTab: nutriTab;
  onTabChange: (tab: nutriTab) => void;
  nombreNutricionista?: string;
  emailNutricionista?: string;
  fotoPerfil?: string;
  pendientesCount?: {
    citas: number;
    examenes: number;
  };
}

export default function NutricionistaSidebar({
  activeTab,
  onTabChange,
  nombreNutricionista = "Especialista",
  emailNutricionista = "clinica@nutrivida.cl",
  fotoPerfil,
  pendientesCount = { citas: 0, examenes: 0 },
}: NutricionistaSidebarProps): JSX.Element {
  const iniciales =
    nombreNutricionista
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "NV";

  const menuItems: {
    id: nutriTab;
    label: string;
    shortLabel: string;
    icon: string;
    badge?: number;
  }[] = [
    {
      id: "dashboard",
      label: "Centro de Mando",
      shortLabel: "Mando",
      icon: "⚡",
    },
    {
      id: "users",
      label: "Agenda y Consultas",
      shortLabel: "Agenda",
      icon: "📅",
      badge: pendientesCount.citas,
    },
    {
      id: "clinical",
      label: "Fichas y Laboratorio",
      shortLabel: "Clínica",
      icon: "🧬",
      badge: pendientesCount.examenes,
    },
    {
      id: "products",
      label: "Catálogo de Planes",
      shortLabel: "Planes",
      icon: "🥗",
    },
    {
      id: "categories",
      label: "Taxonomía y Categorías",
      shortLabel: "Categorías",
      icon: "🗂️",
    },
  ];

  return (
    <>
      {/* =========================================================
          INTERFAZ MÓVIL Y TABLET (< 992px): CINTA DE COMANDOS OSCURA
          ========================================================= */}
      <div className="col-12 d-lg-none mb-3">
        <div
          className="p-3 rounded-4 shadow-sm"
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex justify-content-center align-items-center fw-bolder shadow-sm overflow-hidden flex-shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#10b981",
                  color: "#064e3b",
                  fontSize: "1.1rem",
                }}
              >
                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt={nombreNutricionista}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  iniciales
                )}
              </div>
              <div className="text-truncate">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#10b981",
                    }}
                  />
                  <small
                    className="text-uppercase fw-bold"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.08em",
                      color: "#34d399",
                    }}
                  >
                    Facultativo en Línea
                  </small>
                </div>
                <h6 className="fw-bolder mb-0 text-white text-truncate">
                  {nombreNutricionista}
                </h6>
              </div>
            </div>
            <span className="badge bg-dark border border-secondary border-opacity-50 text-light rounded-pill px-3 py-1">
              PRO
            </span>
          </div>

          <div
            className="d-flex flex-row flex-nowrap overflow-x-auto gap-2 pb-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className="btn rounded-3 px-3 py-2 fw-bold text-nowrap d-flex align-items-center gap-2 flex-shrink-0 border-0 transition-all"
                  style={{
                    backgroundColor: isActive
                      ? "#10b981"
                      : "rgba(255, 255, 255, 0.06)",
                    color: isActive ? "#052e16" : "#cbd5e1",
                    fontSize: "0.85rem",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.shortLabel}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: isActive ? "#052e16" : "#ef4444",
                        color: "#ffffff",
                        fontSize: "0.68rem",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          INTERFAZ PC (>= 992px): CONSOLA CLÍNICA VERTICAL
          ========================================================= */}
      <aside className="col-lg-3 d-none d-lg-block">
        <div
          className="p-4 rounded-5 shadow-lg sticky-lg-top d-flex flex-column justify-content-between"
          style={{
            top: "105px",
            minHeight: "calc(100vh - 135px)",
            background: "linear-gradient(165deg, #0f172a 0%, #111827 100%)",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div>
            {/* Tarjeta de Credencial Médica */}
            <div
              className="p-3 rounded-4 mb-4"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-4 d-flex justify-content-center align-items-center fw-bolder shadow overflow-hidden flex-shrink-0"
                  style={{
                    width: "56px",
                    height: "56px",
                    fontSize: "1.35rem",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                  }}
                >
                  {fotoPerfil ? (
                    <img
                      src={fotoPerfil}
                      alt={nombreNutricionista}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    iniciales
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="d-flex align-items-center gap-1 mb-1">
                    <span
                      className="rounded-circle d-inline-block"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#10b981",
                        boxShadow: "0 0 8px #10b981",
                      }}
                    />
                    <span
                      className="text-uppercase fw-bold"
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        color: "#34d399",
                      }}
                    >
                      Staff Clínico
                    </span>
                  </div>
                  <h6
                    className="fw-bolder text-white mb-0 text-truncate"
                    title={nombreNutricionista}
                  >
                    {nombreNutricionista}
                  </h6>
                  <small
                    className="text-secondary d-block text-truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {emailNutricionista}
                  </small>
                </div>
              </div>
            </div>

            <div
              className="text-uppercase fw-bold px-2 mb-2"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                color: "#64748b",
              }}
            >
              Módulos de Gestión
            </div>

            {/* Botonera de Comandos */}
            <div className="d-flex flex-column gap-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className="btn rounded-4 px-3 py-3 text-start d-flex align-items-center justify-content-between border-0 transition-all"
                    style={{
                      background: isActive
                        ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                        : "transparent",
                      color: isActive ? "#ffffff" : "#94a3b8",
                      fontWeight: isActive ? 700 : 600,
                      boxShadow: isActive
                        ? "0 8px 20px -4px rgba(16, 185, 129, 0.4)"
                        : "none",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-5">{item.icon}</span>
                      <span style={{ fontSize: "0.92rem" }}>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="badge rounded-pill px-2 py-1"
                        style={{
                          backgroundColor: isActive
                            ? "rgba(0,0,0,0.25)"
                            : "rgba(239, 68, 68, 0.2)",
                          color: isActive ? "#ffffff" : "#fca5a5",
                          fontSize: "0.72rem",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pie de Consola */}
          <div
            className="p-3 rounded-4 mt-4"
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="fw-bold" style={{ color: "#34d399" }}>
                Sede Temuco
              </small>
              <span className="badge bg-success bg-opacity-25 text-success small">
                Sincronizado
              </span>
            </div>
            <p className="mb-0 text-secondary" style={{ fontSize: "0.75rem" }}>
              Los cambios en planes, exámenes y catálogo impactan en tiempo real
              el Portal del Paciente.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}