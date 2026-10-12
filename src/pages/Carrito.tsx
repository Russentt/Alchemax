import { useState, useEffect, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import type { Servicio, Compra } from "../data/types";
import { StorageUsuario } from "../services/storageUsuario";

export default function Carrito(): JSX.Element {
  const [carrito, setCarrito] = useState<Servicio[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "warning";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("db_carrito") || "[]");
    setCarrito(storedCart);
  }, []);

  const showToast = (message: string, type: "success" | "warning") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 15000);
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = carrito.filter((item) => item.id !== id);
    localStorage.setItem("db_carrito", JSON.stringify(updatedCart));
    setCarrito(updatedCart);

    showToast("Servicio removido del carrito de compras.", "warning");
  };

  const handleCheckout = () => {
    if (carrito.length === 0) return;

    // Verificamos la sesión activa desde StorageUsuario (o sessionStorage como respaldo)
    const sessionUser =
      StorageUsuario.getUsuarioSesion() ||
      sessionStorage.getItem("session_user");

    if (!sessionUser) {
      showToast(
        "Debes iniciar sesión para procesar el pago y asignar los servicios.",
        "warning",
      );
      setTimeout(() => navigate("/login"), 2500);
      return;
    }

    const existingCompras: Compra[] = JSON.parse(
      localStorage.getItem("db_compras") || "[]",
    );

    const nuevasCompras: Compra[] = carrito.map((item) => ({
      id: `c-${crypto.randomUUID()}`,
      servicioId: item.id,
      nombre: item.nombre,
      fechaCompra: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      monto: item.precio,
      estado: "Activo",
    }));

    localStorage.setItem(
      "db_compras",
      JSON.stringify([...nuevasCompras, ...existingCompras]),
    );

    localStorage.setItem("db_carrito", JSON.stringify([]));
    setCarrito([]);

    showToast(
      "¡Pago procesado con éxito! Los servicios han sido asignados a tu Portal del Paciente.",
      "success",
    );

    setTimeout(() => {
      navigate("/account");
    }, 2500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const totalPagar = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <main className="container my-5 flex-grow-1 position-relative">
      {/* Global Toast Notification Overlay */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 p-4 animation-fade-in"
          style={{ zIndex: 1100, marginTop: "80px" }}
        >
          <div
            className={`toast show align-items-center text-white bg-${notification.type} border-0 shadow-lg rounded-4 p-3`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold px-2 fs-6 lh-base">
                {notification.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setNotification(null)}
                aria-label="Cerrar"
              ></button>
            </div>
            {notification.type === "success" && (
              <div className="px-3 pb-2 text-end mt-2">
                <Link
                  to="/account"
                  className="btn btn-light btn-sm fw-bold text-success rounded-pill px-3 shadow-sm"
                >
                  Ver en mi perfil
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb p-3 bg-white rounded-3 shadow-sm">
          <li className="breadcrumb-item">
            <Link to="/" className="text-success text-decoration-none">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
            {/* 1. Actualización en el Breadcrumb */}
            <Link
              to="/metodologia#catalogo"
              className="text-success text-decoration-none"
            >
              Metodología
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-semibold">
            Carrito de Compras
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Cart Items List */}
        <div className="col-lg-8">
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border-0 h-100">
            <h2 className="fw-bold text-dark mb-4">
              Tus Servicios Seleccionados
            </h2>

            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-3">🛒</div>
                <h5 className="fw-bold text-dark mb-2">
                  Tu carrito está vacío
                </h5>
                <p className="text-muted mb-4">
                  Aún no has agregado ningún plan o evaluación clínica desde
                  nuestro catálogo.
                </p>
                {/* 2. Actualización cuando el carrito está vacío */}
                <Link
                  to="/metodologia#catalogo"
                  className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm"
                >
                  Explorar Catálogo de Servicios
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="fs-2">{item.icono}</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          {item.nombre}
                        </h6>
                        <p className="text-muted small mb-0">
                          {item.descripcion}
                        </p>
                      </div>
                    </div>
                    <div className="text-end ms-3">
                      <h5 className="fw-bold text-success mb-2">
                        {formatPrice(item.precio)}
                      </h5>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="btn btn-sm btn-outline-danger border-0 fw-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

                {/* 3. Nuevo botón para seguir comprando */}
                <div className="mt-4 text-start">
                  <Link
                    to="/metodologia#catalogo"
                    className="btn btn-outline-success fw-bold px-4 rounded-pill shadow-sm"
                  >
                    ← Seguir agregando servicios
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary & Checkout Action */}
        <div className="col-lg-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border-0">
            <h4 className="fw-bold text-dark mb-4">Resumen de Pago</h4>
            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Subtotal</span>
              <span>{formatPrice(totalPagar)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Impuestos / Tasas Clínicas</span>
              <span>\$0</span>
            </div>
            <hr className="text-muted opacity-25 mb-3" />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold text-dark fs-5">Total</span>
              <span className="fw-bold text-success fs-4">
                {formatPrice(totalPagar)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={carrito.length === 0}
              className="btn btn-success w-100 fw-bold py-3 rounded-pill shadow-sm mb-3"
            >
              Proceder al Pago Seguro
            </button>
            <p className="text-muted text-center small mb-0">
              🔒 Transacción encriptada bajo estándares de seguridad
              clínico-financieros.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Animation CSS */}
      <style>{`
        .animation-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
