import { useEffect, useState, useRef, useCallback, type JSX } from "react";
import { Link, useNavigate } from "react-router";
import type { ItemCarrito } from "../types/index";
import { StorageUsuario } from "../services/storageUsuario";
import { TiendaService } from "../services/tiendaService";
import { formatPriceCLP } from "../utils/formatPriceCLP";

export default function Carrito(): JSX.Element {
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [procesandoPago, setProcesandoPago] = useState<boolean>(false);
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "warning" | "info";
  } | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "warning" | "info" = "info",
    ) => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      setNotification({ message, type });
      toastTimerRef.current = window.setTimeout(() => {
        setNotification(null);
        toastTimerRef.current = null;
      }, 4500);
    },
    [],
  );

  // Limpieza del timer al desmontar el componente
  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const cargarCarrito = useCallback(async () => {
    setCargando(true);
    try {
      const items = await TiendaService.getItemsCarrito();
      setItemsCarrito(items);
    } catch (err) {
      console.error("Error al recargar carrito:", err);
      showToast("Error al sincronizar el carrito con el servidor.", "warning");
    } finally {
      setCargando(false);
    }
  }, [showToast]);

  // Carga inicial sin setCargando sincrónico para cumplir regla de React 19 / ESLint
  useEffect(() => {
    let active = true;

    const inicializarCarrito = async () => {
      try {
        const items = await TiendaService.getItemsCarrito();
        if (active) {
          setItemsCarrito(items);
        }
      } catch (err) {
        console.error("Error al inicializar carrito:", err);
        if (active) {
          showToast("Error de conexión al cargar tus servicios.", "warning");
        }
      } finally {
        if (active) {
          setCargando(false);
        }
      }
    };

    inicializarCarrito();

    return () => {
      active = false;
    };
  }, [showToast]);

  const handleIncrement = async (item: ItemCarrito) => {
    if (procesandoPago) return;

    const nuevaCantidad = item.cantidad + 1;
    setActualizandoId(item.servicio.id);

    try {
      // Actualización optimista en la interfaz
      setItemsCarrito((prev) =>
        prev.map((it) =>
          it.servicio.id === item.servicio.id
            ? { ...it, cantidad: nuevaCantidad }
            : it,
        ),
      );

      const actualizado = await TiendaService.actualizarCantidadItem(
        item.servicio.id,
        nuevaCantidad,
        item.id,
      );

      if (!actualizado) {
        throw new Error("No se pudo sincronizar la cantidad con el servidor.");
      }

      showToast(
        `Cantidad aumentada para "${item.servicio.nombre}" (${nuevaCantidad}).`,
        "success",
      );
    } catch (err) {
      console.error(err);
      // Revertir estado optimista recargando el carrito desde el backend
      await cargarCarrito();
      showToast(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la cantidad en el servidor.",
        "warning",
      );
    } finally {
      setActualizandoId(null);
    }
  };

  const handleDecrement = async (item: ItemCarrito) => {
    if (procesandoPago) return;

    if (item.cantidad <= 1) {
      await handleRemoveItem(item.servicio.id, item.servicio.nombre);
      return;
    }

    const nuevaCantidad = item.cantidad - 1;
    setActualizandoId(item.servicio.id);

    try {
      // Actualización optimista en la interfaz
      setItemsCarrito((prev) =>
        prev.map((it) =>
          it.servicio.id === item.servicio.id
            ? { ...it, cantidad: nuevaCantidad }
            : it,
        ),
      );

      const actualizado = await TiendaService.actualizarCantidadItem(
        item.servicio.id,
        nuevaCantidad,
        item.id,
      );

      if (!actualizado) {
        throw new Error("No se pudo sincronizar la cantidad con el servidor.");
      }

      showToast(
        `Cantidad reducida para "${item.servicio.nombre}" (${nuevaCantidad}).`,
        "info",
      );
    } catch (err) {
      console.error(err);
      // Revertir estado optimista recargando el carrito desde el backend
      await cargarCarrito();
      showToast(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la cantidad en el servidor.",
        "warning",
      );
    } finally {
      setActualizandoId(null);
    }
  };

  const handleRemoveItem = async (
    servicioId: number | string,
    nombre?: string,
  ) => {
    if (procesandoPago) return;

    setActualizandoId(Number(servicioId));
    try {
      await TiendaService.removerDelCarrito(servicioId);
      const itemsActualizados = await TiendaService.getItemsCarrito();
      setItemsCarrito(itemsActualizados);

      showToast(
        nombre
          ? `"${nombre}" fue removido de tu carrito.`
          : "Servicio removido del carrito de compras.",
        "warning",
      );
    } catch (err) {
      console.error(err);
      showToast("No se pudo eliminar el servicio del carrito.", "warning");
    } finally {
      setActualizandoId(null);
    }
  };

  const handleVaciarCarrito = async () => {
    if (itemsCarrito.length === 0 || procesandoPago) return;

    setCargando(true);
    try {
      await TiendaService.vaciarCarrito();
      setItemsCarrito([]);
      showToast("El carrito de compras ha sido vaciado.", "info");
    } catch (err) {
      console.error(err);
      showToast("Error al vaciar el carrito.", "warning");
      await cargarCarrito();
    } finally {
      setCargando(false);
    }
  };

  const handleCheckout = async () => {
    if (itemsCarrito.length === 0 || procesandoPago) return;

    const sessionUser = StorageUsuario.getUsuarioSesion();

    if (!sessionUser) {
      showToast(
        "Debes iniciar sesión para procesar el pago y asignar los servicios.",
        "warning",
      );
      setTimeout(() => navigate("/login"), 2500);
      return;
    }

    setProcesandoPago(true);

    try {
      const fechaHoy = new Date().toISOString().split("T")[0];
      let erroresRegistrados = 0;
      let comprasExitosasCount = 0;

      // Se genera una compra por cada unidad adquirida para permitir su agendamiento independiente
      for (const item of itemsCarrito) {
        for (let i = 0; i < item.cantidad; i++) {
          const resultado = await TiendaService.registrarCompra({
            servicio: Number(item.servicio.id),
            nombre: item.servicio.nombre,
            fechaCompra: fechaHoy,
            monto: item.servicio.precio,
            estado: "Activo",
          });

          if (!resultado) {
            erroresRegistrados++;
          } else {
            comprasExitosasCount++;
          }
        }
      }

      if (erroresRegistrados > 0 && comprasExitosasCount === 0) {
        showToast(
          "No fue posible procesar el pago con el servidor. Tu carrito sigue intacto.",
          "warning",
        );
        await cargarCarrito();
        return;
      }

      if (erroresRegistrados > 0) {
        showToast(
          `Se procesaron ${comprasExitosasCount} servicio(s), pero ${erroresRegistrados} fallaron. Revisa tu cuenta.`,
          "warning",
        );
        await cargarCarrito();
        return;
      }

      // Solo si todas las compras se registraron con éxito, vaciamos el carrito
      await TiendaService.vaciarCarrito();
      setItemsCarrito([]);

      showToast(
        "¡Pago procesado con éxito! Los servicios han sido asignados a tu Portal del Paciente.",
        "success",
      );

      setTimeout(() => {
        navigate("/account");
      }, 2500);
    } catch (err) {
      console.error("Error durante el checkout:", err);
      showToast("Error inesperado durante el procesamiento del pago.", "warning");
      await cargarCarrito();
    } finally {
      setProcesandoPago(false);
    }
  };

  const totalUnidades = itemsCarrito.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );

  const totalPagar = itemsCarrito.reduce(
    (acc, item) => acc + item.servicio.precio * item.cantidad,
    0,
  );

  return (
    <main className="container my-5 flex-grow-1 position-relative">
      {/* Notificaciones Toast Accesibles */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 p-4 animation-fade-in"
          style={{ zIndex: 1100, marginTop: "80px" }}
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className={`toast show align-items-center text-white bg-${notification.type === "info" ? "primary" : notification.type} border-0 shadow-lg rounded-4 p-3`}
            role="status"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold px-2 fs-6 lh-base">
                {notification.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setNotification(null)}
                aria-label="Cerrar notificación"
              ></button>
            </div>
            {notification.type === "success" && (
              <div className="px-3 pb-2 text-end mt-2">
                <Link
                  to="/account"
                  className="btn btn-light btn-sm fw-bold text-success rounded-pill px-3 shadow-sm"
                >
                  Ver en mi perfil →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Migas de Pan */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb p-3 bg-white rounded-3 shadow-sm">
          <li className="breadcrumb-item">
            <Link to="/" className="text-success text-decoration-none">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
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
        {/* Listado de Servicios y Controles de Cantidad */}
        <div className="col-lg-8">
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border-0 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  Tus Servicios Seleccionados
                </h2>
                <p className="text-muted small mb-0">
                  Ajusta la cantidad de sesiones o prestaciones antes de
                  confirmar tu atención.
                </p>
              </div>
              {itemsCarrito.length > 0 && (
                <button
                  type="button"
                  onClick={handleVaciarCarrito}
                  disabled={procesandoPago || cargando}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                  title="Eliminar todos los ítems del carrito"
                >
                  Vaciar carrito
                </button>
              )}
            </div>

            {cargando ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-success mb-3"
                  role="status"
                ></div>
                <p className="text-muted small">Cargando tus servicios...</p>
              </div>
            ) : itemsCarrito.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-3">🛒</div>
                <h5 className="fw-bold text-dark mb-2">
                  Tu carrito está vacío
                </h5>
                <p className="text-muted mb-4">
                  Aún no has agregado ningún plan o evaluación clínica desde
                  nuestro catálogo.
                </p>
                <Link
                  to="/metodologia#catalogo"
                  className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm"
                >
                  Explorar Catálogo de Servicios
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {itemsCarrito.map((item) => {
                  const subtotalItem = item.servicio.precio * item.cantidad;
                  const isBusy =
                    actualizandoId === item.servicio.id || procesandoPago;

                  return (
                    <div
                      key={item.servicio.id}
                      className="p-3 p-md-4 bg-light rounded-4 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 transition-all hover-lift"
                    >
                      {/* Información de la Prestación */}
                      <div className="d-flex align-items-start gap-3 flex-grow-1">
                        <div
                          className="fs-2 p-2 rounded-3 bg-white shadow-sm border d-flex align-items-center justify-content-center"
                          style={{ width: "52px", height: "52px" }}
                        >
                          {item.servicio.icono || "🥗"}
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="fw-bold text-dark mb-0">
                              {item.servicio.nombre}
                            </h6>
                            {item.servicio.categoriaNombre && (
                              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small">
                                {item.servicio.categoriaNombre}
                              </span>
                            )}
                          </div>
                          <p className="text-muted small mb-2 text-truncate-2">
                            {item.servicio.descripcion}
                          </p>
                          <div className="small text-secondary">
                            Precio unitario:{" "}
                            <span className="fw-bold text-dark">
                              {formatPriceCLP(item.servicio.precio)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controles Interactivos de Cantidad y Subtotal */}
                      <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3 pt-2 pt-md-0 border-top border-md-top-0">
                        {/* Selector de Cantidades (+ / -) */}
                        <div
                          className="d-flex align-items-center border rounded-pill px-2 py-1 bg-white shadow-sm"
                          style={{ minWidth: "115px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold fs-5 lh-1"
                            onClick={() => handleDecrement(item)}
                            disabled={isBusy}
                            title={
                              item.cantidad <= 1
                                ? "Quitar del carrito"
                                : "Disminuir cantidad"
                            }
                            aria-label={`Disminuir cantidad de ${item.servicio.nombre}`}
                          >
                            −
                          </button>

                          <span
                            className="fw-bold font-monospace fs-6 px-1 flex-grow-1 text-center"
                            style={{ minWidth: "2rem" }}
                            aria-live="polite"
                            aria-label={`Cantidad seleccionada: ${item.cantidad}`}
                          >
                            {item.cantidad}
                          </span>

                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold fs-5 lh-1"
                            onClick={() => handleIncrement(item)}
                            disabled={isBusy}
                            title="Aumentar cantidad"
                            aria-label={`Aumentar cantidad de ${item.servicio.nombre}`}
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal del Servicio */}
                        <div className="text-end" style={{ minWidth: "120px" }}>
                          <h5 className="fw-bold text-success mb-0">
                            {formatPriceCLP(subtotalItem)}
                          </h5>
                          {item.cantidad > 1 && (
                            <small className="text-muted d-block font-monospace">
                              {item.cantidad} x{" "}
                              {formatPriceCLP(item.servicio.precio)}
                            </small>
                          )}
                        </div>

                        {/* Botón Eliminar */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              item.servicio.id,
                              item.servicio.nombre,
                            )
                          }
                          disabled={isBusy}
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2 lh-1"
                          title="Eliminar prestación"
                          aria-label={`Eliminar ${item.servicio.nombre} del carrito`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}

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

        {/* Resumen de Pago y Checkout */}
        <div className="col-lg-4">
          <div
            className="bg-white p-4 rounded-4 shadow-sm border-0 sticky-top"
            style={{ top: "90px" }}
          >
            <h4 className="fw-bold text-dark mb-3">Resumen de Pago</h4>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Total de prestaciones</span>
              <span
                className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold"
                aria-live="polite"
              >
                {totalUnidades} {totalUnidades === 1 ? "sesión" : "sesiones"}
              </span>
            </div>

            {itemsCarrito.length > 0 && (
              <div className="mb-3 p-3 bg-light rounded-3 small">
                {itemsCarrito.map((it) => (
                  <div
                    key={it.servicio.id}
                    className="d-flex justify-content-between text-muted mb-1"
                  >
                    <span
                      className="text-truncate me-2"
                      style={{ maxWidth: "160px" }}
                    >
                      {it.servicio.nombre} (x{it.cantidad})
                    </span>
                    <span className="fw-semibold text-dark">
                      {formatPriceCLP(it.servicio.precio * it.cantidad)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Subtotal Neto</span>
              <span>{formatPriceCLP(totalPagar)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Impuestos / Tasas Clínicas</span>
              <span className="text-success fw-bold">Exento</span>
            </div>
            <hr className="text-muted opacity-25 mb-3" />
            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="fw-bold text-dark fs-5">Total a Pagar</span>
              <span className="fw-bolder text-success fs-3">
                {formatPriceCLP(totalPagar)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={
                itemsCarrito.length === 0 || cargando || procesandoPago
              }
              className="btn btn-success w-100 fw-bold py-3 rounded-pill shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
            >
              {procesandoPago ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Procesando Pago Seguro...</span>
                </>
              ) : (
                <span>🔒 Proceder al Pago Seguro</span>
              )}
            </button>

            <p className="text-muted text-center small mb-0">
              Transacción protegida bajo estándares de encriptación y
              confidencialidad clínica.
            </p>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .animation-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
