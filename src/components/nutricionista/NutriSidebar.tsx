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
      {/* INTERFAZ MÓVIL Y TABLET (< 992px): CINTA DE COMANDOS CLARA */}
      <div className="col-12 d-lg-none mb-3">
        <div className="glass-panel p-3 rounded-4 shadow-sm border">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-opacity-10">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex justify-content-center align-items-center fw-bolder shadow-sm overflow-hidden flex-shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#27ae60",
                  color: "#ffffff",
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
                      backgroundColor: "#27ae60",
                    }}
                  />
                  <small
                    className="text-uppercase fw-bold text-success"
                    style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
                  >
                    Facultativo en Línea
                  </small>
                </div>
                <h6 className="fw-bolder mb-0 text-dark text-truncate">
                  {nombreNutricionista}
                </h6>
              </div>
            </div>
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1">
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
                    backgroundColor: isActive ? "#27ae60" : "rgba(0, 0, 0, 0.04)",
                    color: isActive ? "#ffffff" : "#495057",
                    fontSize: "0.85rem",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.shortLabel}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: isActive ? "#ffffff" : "#dc3545",
                        color: isActive ? "#27ae60" : "#ffffff",
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

      {/* INTERFAZ PC (>= 992px): SIDEBAR VERTICAL LUMINOSO */}
      <aside className="col-lg-3 d-none d-lg-block">
        <div
          className="glass-card p-4 rounded-5 shadow-glass sticky-lg-top d-flex flex-column justify-content-between border-0"
          style={{ top: "110px", minHeight: "calc(100vh - 140px)" }}
        >
          <div>
            <div className="p-3 rounded-4 mb-4 bg-white border shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-4 d-flex justify-content-center align-items-center fw-bolder shadow-sm overflow-hidden flex-shrink-0"
                  style={{
                    width: "56px",
                    height: "56px",
                    fontSize: "1.35rem",
                    background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                    color: "#ffffff",
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
                <div className="overflow-hidden">
                  <div className="d-flex align-items-center gap-1 mb-1">
                    <span
                      className="rounded-circle d-inline-block"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#27ae60",
                      }}
                    />
                    <small
                      className="text-uppercase fw-bold text-success"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
                    >
                      Staff Clínico
                    </small>
                  </div>
                  <h6
                    className="fw-bolder text-dark mb-0 text-truncate"
                    title={nombreNutricionista}
                  >
                    {nombreNutricionista}
                  </h6>
                  <small
                    className="text-muted d-block text-truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {emailNutricionista}
                  </small>
                </div>
              </div>
            </div>

            <div
              className="text-uppercase fw-bold px-2 mb-2 text-muted"
              style={{ fontSize: "0.68rem", letterSpacing: "0.1em" }}
            >
              Módulos de Gestión
            </div>

            <div className="d-flex flex-column gap-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className="btn rounded-4 px-3 py-3 text-start d-flex align-items-center justify-content-between border-0 transition-all hover-lift"
                    style={{
                      background: isActive
                        ? "linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)"
                        : "transparent",
                      color: isActive ? "#ffffff" : "#495057",
                      fontWeight: isActive ? 700 : 600,
                      boxShadow: isActive
                        ? "0 8px 20px -4px rgba(39, 174, 96, 0.3)"
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
                          backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#dc3545",
                          color: "#ffffff",
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

          <div className="p-3 rounded-4 mt-4 bg-light border">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="fw-bold text-success">Sede Temuco</small>
              <span className="badge bg-success-subtle text-success small">Sincronizado</span>
            </div>
            <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
              Los cambios impactan en tiempo real el Portal del Paciente.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}