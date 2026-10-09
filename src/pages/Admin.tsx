import React, { useState, type JSX } from "react";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import AdminStatCard from "../components/admin/AdminStatCard";

export default function Admin(): JSX.Element {
  // State controls which administrative view is currently rendered
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Sub-view: Dashboard (Metrics & Previews)
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <AdminStatCard
          title="Total Productos"
          value={24}
          icon="🛒"
          theme="success"
        />
        <AdminStatCard
          title="Categorías Activas"
          value={5}
          icon="📁"
          theme="info"
        />
        <AdminStatCard
          title="Pacientes Registrados"
          value={142}
          icon="👥"
          theme="warning"
        />
      </div>
      <div className="bg-white p-4 rounded-4 shadow-sm border-0">
        <h5 className="fw-bold text-dark mb-3">
          Actividad Reciente del Sistema
        </h5>
        <p className="text-muted">
          El sistema está operando con normalidad. No hay alertas críticas de
          stock ni errores de base de datos.
        </p>
      </div>
    </>
  );

  // Sub-view: Product Management
  const renderProducts = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">
          Catálogo de Servicios y Planes
        </h5>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
        >
          + Nuevo Producto
        </button>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre del Plan</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-muted small fw-bold">#PROD-101</td>
              <td className="fw-semibold">Plan Nutricional Deportivo</td>
              <td>
                <span className="badge bg-secondary-subtle text-secondary">
                  Planes Especializados
                </span>
              </td>
              <td>$45.000</td>
              <td>
                <span className="badge bg-success">Activo</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary me-2"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-danger"
                >
                  Bajar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Sub-view: Categories Management
  const renderCategories = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Gestión de Categorías</h5>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
        >
          + Nueva Categoría
        </button>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>ID Categoría</th>
              <th>Nombre</th>
              <th>Servicios Asociados</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-muted small fw-bold">#CAT-01</td>
              <td className="fw-semibold">Evaluación Biométrica</td>
              <td>12</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary"
                >
                  Modificar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Sub-view: User Accounts Management
  const renderUsers = () => (
    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Administración de Cuentas</h5>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Buscar usuario..."
          />
          <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold text-nowrap"
          >
            + Nuevo Usuario
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Rol del Sistema</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-semibold">Alexander Mejias</td>
              <td className="text-muted">a.mejias@admin.cl</td>
              <td>
                <span className="badge bg-danger-subtle text-danger">
                  Product Owner
                </span>
              </td>
              <td>
                <span className="badge bg-success">Activo</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary me-2"
                >
                  Permisos
                </button>
              </td>
            </tr>
            <tr>
              <td className="fw-semibold">Lucas Ortiz</td>
              <td className="text-muted">l.ortiz@admin.cl</td>
              <td>
                <span className="badge bg-dark-subtle text-dark">
                  Backend Dev
                </span>
              </td>
              <td>
                <span className="badge bg-success">Activo</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary me-2"
                >
                  Permisos
                </button>
              </td>
            </tr>
            <tr>
              <td className="fw-semibold">Camila Soto</td>
              <td className="text-muted">camila.soto@email.com</td>
              <td>
                <span className="badge bg-primary-subtle text-primary">
                  Paciente
                </span>
              </td>
              <td>
                <span className="badge bg-success">Activo</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-primary me-2"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-danger"
                >
                  Suspender
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Dynamic router logic to swap the main content
  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "categories":
        return renderCategories();
      case "users":
        return renderUsers();
      default:
        return renderDashboard();
    }
  };

  return (
    <main className="container-fluid py-4 px-4 px-md-5 bg-light flex-grow-1">
      <div className="row g-4">
        {/* The Sidebar is passed the current state and the setter function */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="col-lg-9 col-md-8">
          {/* Persistent Header */}
          <div className="bg-dark text-white p-4 rounded-4 shadow-sm mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold mb-1">Panel de Control</h3>
              <p className="mb-0 text-white-50">
                {activeTab === "dashboard" &&
                  "Gestiona los recursos y métricas de NutriVida."}
                {activeTab === "products" &&
                  "Administra el catálogo de servicios ofrecidos."}
                {activeTab === "categories" &&
                  "Configura la estructura del catálogo."}
                {activeTab === "users" &&
                  "Control de permisos y cuentas de pacientes."}
              </p>
            </div>
            <div className="d-none d-sm-block fs-1">⚙️</div>
          </div>

          {/* Render the selected view */}
          {renderActiveContent()}
        </section>
      </div>
    </main>
  );
}
