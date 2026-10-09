import { Link } from "react-router";
import { useState } from "react";

export default function Carrito() {
  // In your new architecture, initialize this state with your cart data
  const [] = useState([]);

  return (
    <main className="container my-auto py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="bg-white p-5 rounded-4 shadow-sm border-0">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success">Mi Carrito de Compras</h2>
              <p className="text-muted">
                Revisa tus productos antes de finalizar la compra.
              </p>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mt-4">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>{/* React will map over cartItems here */}</tbody>
              </table>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top">
              <h4 className="mb-3 mb-md-0">
                Total: <span className="text-success fw-bold">$0</span>
              </h4>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link
                  to="/metodologia#servicios"
                  className="btn btn-outline-secondary fw-bold"
                >
                  Volver al Catálogo
                </Link>
                <button className="btn btn-outline-danger">
                  Vaciar Carrito
                </button>
                <button className="btn btn-success fw-bold">
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
