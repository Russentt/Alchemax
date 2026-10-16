import { type JSX } from "react";

export type AdminTab = "dashboard" | "products" | "categories" | "users" | "terminal";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: AdminSidebarProps): JSX.Element {
  
  const getTabClass = (tabName: AdminTab) =>
    `nav-link fw-bold rounded-3 px-3 py-3 text-start w-100 border-0 transition-all d-flex align-items-center gap-3 ${
      activeTab === tabName
        ? "bg-primary text-white shadow-sm"
        : "text-secondary hover-lift bg-transparent"
    }`;

  return (
    <aside className="col-lg-3 col-md-4 mb-4 mb-md-0 align-self-start">
      <div 
        className="p-4 rounded-4 shadow-lg border-0 d-flex flex-column justify-content-between"
        style={{ background: 'linear-gradient(145deg, #111827 0%, #1f2937 100%)', color: '#e5e7eb' }}
      >
        <div>
          <div className="text-center mb-4">
            <div
              className="rounded-circle d-inline-flex justify-content-center align-items-center fw-bolder mb-3 shadow"
              style={{ 
                width: "70px", 
                height: "70px", 
                fontSize: "1.8rem", 
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "#ffffff"
              }}
            >
              root
            </div>
            <h5 className="fw-bolder text-white mb-1 tracking-tight">Administrador</h5>
            <span className="badge border border-primary text-primary bg-primary bg-opacity-10 rounded-pill px-3 py-1 fw-bold">
              uid=0 (root)
            </span>
          </div>

          <hr className="mb-4 opacity-10 border-secondary" />

          <div className="nav flex-column nav-pills gap-2">
            <button
              type="button"
              onClick={() => onTabChange("dashboard")}
              className={getTabClass("dashboard")}
            >
              <span className="fs-5">📊</span> Métricas del Sistema
            </button>
            <button
              type="button"
              onClick={() => onTabChange("products")}
              className={getTabClass("products")}
            >
              <span className="fs-5">📦</span> Catálogo de Servicios
            </button>
            <button
              type="button"
              onClick={() => onTabChange("categories")}
              className={getTabClass("categories")}
            >
              <span className="fs-5">🗂️</span> Categorías Clínicas
            </button>
            <button
              type="button"
              onClick={() => onTabChange("users")}
              className={getTabClass("users")}
            >
              <span className="fs-5">👥</span> Cuentas de Usuario
            </button>
            <button
              type="button"
              onClick={() => onTabChange("terminal")}
              className={getTabClass("terminal")}
            >
              <span className="fs-5">💻</span> Terminal Alchemax
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="d-flex align-items-center justify-content-between mb-1">
            <small className="fw-bold text-white" style={{ fontSize: '0.7rem' }}>ESTADO DEL NÚCLEO</small>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></span>
          </div>
          <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
            Motor NutriVida en línea.
          </p>
        </div>
      </div>
    </aside>
  );
}