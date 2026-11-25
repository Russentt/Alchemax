import { useEffect, useState, type JSX } from "react";
import type { Servicio, Usuario } from "../types/index";
import { formatPriceCLP } from "../utils/formatPriceCLP";

type PaymentMethod = "credito" | "debito" | "paypal";
type CardBrand = "Visa" | "Mastercard" | "American Express" | "Redcompra";
type PaymentStep = "form" | "processing" | "success";

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onGoToAccount: () => void;
  items: Servicio[];
  usuario: Usuario | null;
}

const CREDIT_BRANDS: CardBrand[] = ["Visa", "Mastercard", "American Express"];
const DEBIT_BRANDS: CardBrand[] = ["Redcompra", "Visa", "Mastercard"];
const BANCOS_CHILE = [
  "BancoEstado",
  "Banco de Chile",
  "Banco Santander",
  "BCI",
  "Scotiabank",
  "Banco Itaú",
];

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrandFromDigits(
  digits: string,
  method: PaymentMethod,
): CardBrand | null {
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits) && method === "credito") return "American Express";
  return null;
}

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  onGoToAccount,
  items,
  usuario,
}: PaymentGatewayModalProps): JSX.Element | null {
  const [method, setMethod] = useState<PaymentMethod>("credito");
  const [brand, setBrand] = useState<CardBrand>("Visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(usuario?.nombre ?? "");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cuotas, setCuotas] = useState("1");
  const [banco, setBanco] = useState(BANCOS_CHILE[0]);
  const [paypalEmail, setPaypalEmail] = useState(usuario?.email ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<PaymentStep>("form");
  const [orderInfo, setOrderInfo] = useState({
    orderCode: "NV-2026-841029",
    authCode: "629418",
    timestamp: "",
    paidAmount: 0,
    installments: "1",
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, step, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.precio, 0);
  const montoFinal = subtotal > 0 ? subtotal : 35000;
  const availableBrands = method === "credito" ? CREDIT_BRANDS : DEBIT_BRANDS;

  const handleMethodChange = (nextMethod: PaymentMethod) => {
    setMethod(nextMethod);
    setFormError(null);
    if (nextMethod === "credito" && brand === "Redcompra") {
      setBrand("Visa");
    } else if (nextMethod === "debito" && brand === "American Express") {
      setBrand("Redcompra");
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setFormError(null);
    const digits = formatted.replace(/\D/g, "");
    const detected = detectBrandFromDigits(digits, method);
    if (detected) {
      setBrand(detected);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (method === "paypal") {
      const cleanPaypal = paypalEmail.trim();
      if (!cleanPaypal || !cleanPaypal.includes("@")) {
        setFormError("Ingresa un correo válido asociado a tu cuenta PayPal.");
        return;
      }
    } else {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 15) {
        setFormError("Ingresa un número de tarjeta válido (15 o 16 dígitos).");
        return;
      }
      if (cardHolder.trim().length < 3) {
        setFormError(
          "Ingresa el nombre del titular tal como figura en la tarjeta.",
        );
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        setFormError("Ingresa una fecha de vencimiento válida (MM/AA).");
        return;
      }
      if (cvv.replace(/\D/g, "").length < 3) {
        setFormError("Ingresa un código de seguridad (CVV) válido.");
        return;
      }
    }

    setStep("processing");

    const now = new Date();
    const orderCode = `NV-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;
    const authCode = String(100000 + (now.getTime() % 899999));
    const timestamp = now.toLocaleString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const amountAtPayment = montoFinal;
    const selectedInstallments = method === "credito" ? cuotas : "1";

    window.setTimeout(() => {
      setOrderInfo({
        orderCode,
        authCode,
        timestamp,
        paidAmount: amountAtPayment,
        installments: selectedInstallments,
      });
      setStep("success");
      onPaymentSuccess();
    }, 1400);
  };

  const last4 = cardNumber.replace(/\D/g, "").slice(-4) || "4242";

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
      style={{
        zIndex: 1080,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="webpayModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "processing") {
          onClose();
        }
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden w-100 my-auto"
        style={{ maxWidth: "620px" }}
      >
        {/* Encabezado estilo Webpay Plus */}
        <div
          className="px-4 py-3 text-white d-flex justify-content-between align-items-center"
          style={{
            background:
              "linear-gradient(135deg, #2d1457 0%, #5b21b6 65%, #7c3aed 100%)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fw-bolder"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(255,255,255,0.16)",
                fontSize: "1.1rem",
              }}
            >
              💳
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5
                  id="webpayModalTitle"
                  className="mb-0 fw-bolder tracking-tight"
                >
                  Webpay Plus
                </h5>
                <span
                  className="badge bg-light text-dark rounded-pill"
                  style={{ fontSize: "0.68rem" }}
                >
                  DEMO
                </span>
              </div>
              <small className="opacity-75">
                Clínica NutriVida • Conexión cifrada SSL
              </small>
            </div>
          </div>

          {step !== "processing" && (
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar pasarela de pago"
              onClick={onClose}
            />
          )}
        </div>

        {/* Barra de resumen de monto */}
        <div className="bg-light border-bottom px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <small
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: "0.7rem" }}
            >
              Comercio / Detalle
            </small>
            <span className="fw-semibold text-dark small">
              {items.length > 0
                ? `${items.length} ${items.length === 1 ? "servicio clínico seleccionado" : "servicios clínicos seleccionados"}`
                : "Evaluación Clínica NutriVida (Demo)"}
            </span>
          </div>
          <div className="text-end">
            <small
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: "0.7rem" }}
            >
              Total a pagar
            </small>
            <span className="fs-4 fw-bolder text-success">
              {formatPriceCLP(
                step === "success" ? orderInfo.paidAmount : montoFinal,
              )}
            </span>
          </div>
        </div>

        <div className="card-body p-4 bg-white">
          {step === "form" && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Selector de medio de pago */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted mb-2">
                  Selecciona tu medio de pago
                </label>
                <div className="row g-2">
                  <div className="col-4">
                    <button
                      type="button"
                      onClick={() => handleMethodChange("credito")}
                      className={`btn w-100 py-2 px-2 rounded-3 fw-semibold small border ${
                        method === "credito"
                          ? "btn-dark text-white shadow-sm"
                          : "btn-light text-dark"
                      }`}
                    >
                      💳 Crédito
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      type="button"
                      onClick={() => handleMethodChange("debito")}
                      className={`btn w-100 py-2 px-2 rounded-3 fw-semibold small border ${
                        method === "debito"
                          ? "btn-dark text-white shadow-sm"
                          : "btn-light text-dark"
                      }`}
                    >
                      🏧 Débito
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      type="button"
                      onClick={() => handleMethodChange("paypal")}
                      className={`btn w-100 py-2 px-2 rounded-3 fw-semibold small border ${
                        method === "paypal"
                          ? "btn-primary text-white shadow-sm"
                          : "btn-light text-dark"
                      }`}
                    >
                      🅿️ PayPal
                    </button>
                  </div>
                </div>
              </div>

              {formError && (
                <div
                  className="alert alert-danger py-2 px-3 small mb-3"
                  role="alert"
                >
                  ⚠️ {formError}
                </div>
              )}

              {method === "paypal" ? (
                <div className="p-3 rounded-4 border bg-light mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fw-bolder text-primary fs-5">
                      PayPal Checkout
                    </span>
                    <span className="badge bg-primary-subtle text-primary rounded-pill">
                      Pago Express
                    </span>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="webpayPaypalEmail"
                      className="form-label small fw-bold text-dark"
                    >
                      Correo de tu cuenta PayPal
                    </label>
                    <input
                      id="webpayPaypalEmail"
                      type="email"
                      className="form-control apple-input"
                      placeholder="usuario@ejemplo.com"
                      value={paypalEmail}
                      onChange={(e) => {
                        setPaypalEmail(e.target.value);
                        setFormError(null);
                      }}
                      required
                    />
                  </div>
                  <p className="text-muted small mb-0">
                    Al confirmar, se simulará la autorización inmediata del pago
                    con tu cuenta PayPal por {formatPriceCLP(montoFinal)}.
                  </p>
                </div>
              ) : (
                <>
                  {/* Selector de marca de tarjeta */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-2">
                      Marca de tarjeta (
                      {method === "credito" ? "Crédito" : "Débito"})
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {availableBrands.map((itemBrand) => (
                        <button
                          key={itemBrand}
                          type="button"
                          onClick={() => setBrand(itemBrand)}
                          className={`btn btn-sm rounded-pill px-3 fw-bold border ${
                            brand === itemBrand
                              ? "btn-success text-white"
                              : "btn-outline-secondary"
                          }`}
                        >
                          {itemBrand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Número de tarjeta */}
                  <div className="mb-3">
                    <label
                      htmlFor="webpayCardNumber"
                      className="form-label small fw-bold text-dark"
                    >
                      Número de tarjeta
                    </label>
                    <div className="input-group">
                      <input
                        id="webpayCardNumber"
                        type="text"
                        inputMode="numeric"
                        className="form-control apple-input font-monospace"
                        placeholder="4532 1234 5678 9012"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        required
                      />
                      <span className="input-group-text bg-light fw-bold small text-dark">
                        {brand}
                      </span>
                    </div>
                  </div>

                  {/* Titular */}
                  <div className="mb-3">
                    <label
                      htmlFor="webpayCardHolder"
                      className="form-label small fw-bold text-dark"
                    >
                      Nombre del titular
                    </label>
                    <input
                      id="webpayCardHolder"
                      type="text"
                      className="form-control apple-input"
                      placeholder="Como aparece en la tarjeta"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value);
                        setFormError(null);
                      }}
                      maxLength={60}
                      required
                    />
                  </div>

                  {/* Vencimiento y CVV */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label
                        htmlFor="webpayExpiry"
                        className="form-label small fw-bold text-dark"
                      >
                        Vencimiento (MM/AA)
                      </label>
                      <input
                        id="webpayExpiry"
                        type="text"
                        inputMode="numeric"
                        className="form-control apple-input font-monospace"
                        placeholder="08/29"
                        value={expiry}
                        onChange={(e) => {
                          setExpiry(formatExpiry(e.target.value));
                          setFormError(null);
                        }}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="webpayCvv"
                        className="form-label small fw-bold text-dark"
                      >
                        Código de seguridad (CVV)
                      </label>
                      <input
                        id="webpayCvv"
                        type="password"
                        inputMode="numeric"
                        className="form-control apple-input font-monospace"
                        placeholder={
                          brand === "American Express" ? "1234" : "123"
                        }
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                          setFormError(null);
                        }}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Cuotas (Crédito) o Banco (Débito) */}
                  {method === "credito" ? (
                    <div className="mb-4">
                      <label
                        htmlFor="webpayCuotas"
                        className="form-label small fw-bold text-dark"
                      >
                        Tipo de cuotas
                      </label>
                      <select
                        id="webpayCuotas"
                        className="form-select apple-input"
                        value={cuotas}
                        onChange={(e) => setCuotas(e.target.value)}
                      >
                        <option value="1">
                          Sin cuotas (1 pago de {formatPriceCLP(montoFinal)})
                        </option>
                        <option value="3">
                          3 cuotas sin interés (
                          {formatPriceCLP(Math.round(montoFinal / 3))}/mes)
                        </option>
                        <option value="6">
                          6 cuotas ({formatPriceCLP(Math.round(montoFinal / 6))}
                          /mes)
                        </option>
                        <option value="12">
                          12 cuotas (
                          {formatPriceCLP(Math.round(montoFinal / 12))}/mes)
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label
                        htmlFor="webpayBanco"
                        className="form-label small fw-bold text-dark"
                      >
                        Banco emisor
                      </label>
                      <select
                        id="webpayBanco"
                        className="form-select apple-input"
                        value={banco}
                        onChange={(e) => setBanco(e.target.value)}
                      >
                        {BANCOS_CHILE.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Lista breve de servicios si hay items */}
              {items.length > 0 && (
                <div className="p-3 rounded-3 bg-light border mb-4">
                  <small
                    className="fw-bold text-muted text-uppercase d-block mb-2"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Servicios incluidos
                  </small>
                  <ul className="list-unstyled mb-0 small">
                    {items.map((srv, idx) => (
                      <li
                        key={`${srv.id}-${idx}`}
                        className="d-flex justify-content-between py-1 border-bottom border-opacity-10"
                      >
                        <span className="text-dark">
                          {srv.icono} {srv.nombre}
                        </span>
                        <span className="fw-semibold text-success">
                          {formatPriceCLP(srv.precio)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                >
                  Anular y volver
                </button>
                <button
                  type="submit"
                  className="btn btn-success rounded-pill px-4 fw-bold shadow-sm"
                >
                  🔒 Pagar {formatPriceCLP(montoFinal)}
                </button>
              </div>

              <p
                className="text-center text-muted mb-0 mt-3"
                style={{ fontSize: "0.75rem" }}
              >
                Entorno de demostración — No se realizan cargos reales ni se
                almacenan datos bancarios.
              </p>
            </form>
          )}

          {step === "processing" && (
            <div className="text-center py-5">
              <div
                className="spinner-border text-success mb-4"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Procesando pago...</span>
              </div>
              <h5 className="fw-bold text-dark mb-2">
                Conectando con la entidad emisora...
              </h5>
              <p className="text-muted small mb-0">
                Validando autorización{" "}
                {method === "paypal" ? "PayPal" : `${brand} (${method})`} de
                forma segura.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-3">
              <div
                className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "68px", height: "68px", fontSize: "2rem" }}
              >
                ✓
              </div>
              <h4 className="fw-bolder text-dark mb-1">
                ¡Transacción Aprobada!
              </h4>
              <p className="text-muted small mb-4">
                Tu comprobante de pago simulado ha sido generado exitosamente.
              </p>

              <div className="p-3 rounded-4 bg-light border text-start small mb-4">
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Orden de compra</span>
                  <span className="fw-bold font-monospace text-dark">
                    {orderInfo.orderCode}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Código de autorización</span>
                  <span className="fw-bold font-monospace text-dark">
                    {orderInfo.authCode}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Medio de pago</span>
                  <span className="fw-semibold text-dark">
                    {method === "paypal"
                      ? `PayPal (${paypalEmail.trim()})`
                      : `${brand} ${method === "credito" ? "Crédito" : "Débito"} •••• ${last4}`}
                  </span>
                </div>
                {method === "credito" && Number(orderInfo.installments) > 1 && (
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Cuotas pactadas</span>
                    <span className="fw-semibold text-dark">
                      {orderInfo.installments} cuotas de{" "}
                      {formatPriceCLP(
                        Math.round(
                          orderInfo.paidAmount / Number(orderInfo.installments),
                        ),
                      )}
                    </span>
                  </div>
                )}
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Fecha y hora</span>
                  <span className="fw-semibold text-dark">
                    {orderInfo.timestamp}
                  </span>
                </div>
                <div className="d-flex justify-content-between pt-2 mt-1 border-top">
                  <span className="fw-bold text-dark">Monto pagado</span>
                  <span className="fw-bolder text-success">
                    {formatPriceCLP(orderInfo.paidAmount)}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                >
                  Seguir explorando
                </button>
                <button
                  type="button"
                  onClick={onGoToAccount}
                  className="btn btn-success rounded-pill px-4 fw-bold"
                >
                  Ir a Mi Portal →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
