import { type JSX } from "react";

export type AdminTab = "dashboard" | "products" | "categories" | "users";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: AdminSidebarProps): JSX.Element {
  const getTabClass = (tabName: AdminTab) =>
    `nav-link fw-semibold rounded-3 px-3 py-2 text-start w-100 border-0 ${
      activeTab === tabName
        ? "active bg-success text-white"
        : "text-dark bg-light"
    }`;

  return (
    <aside className="col-lg-3 col-md-4 mb-4 mb-md-0">
      <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-0">
        <div className="text-center mb-4">
          <div
            className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center fw-bold mb-2"
            style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
          >
            AD
          </div>
          <h5 className="fw-bold text-dark mb-1">Administrador</h5>
          <span className="badge bg-danger-subtle text-danger rounded-pill">
            Acceso Total
          </span>
        </div>

        <hr className="text-muted mb-4 opacity-25" />

        <div className="nav flex-column nav-pills gap-2">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className={getTabClass("dashboard")}
          >
            📊 Resumen General
          </button>
          <button
            type="button"
            onClick={() => onTabChange("products")}
            className={getTabClass("products")}
          >
            🛒 Gestión de Productos
          </button>
          <button
            type="button"
            onClick={() => onTabChange("categories")}
            className={getTabClass("categories")}
          >
            📁 Categorías
          </button>
          <button
            type="button"
            onClick={() => onTabChange("users")}
            className={getTabClass("users")}
          >
            👥 Cuentas de Usuario
          </button>
        </div>
      </div>
    </aside>
  );
}
