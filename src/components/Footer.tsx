import { type JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-white border-top mt-auto py-5 shadow-sm">
      <div className="container-fluid px-4 px-md-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <h5 className="fw-bold text-success mb-2">NutriVida</h5>
            <p className="text-muted small mb-0">
              © 2026 NutriVida. Temuco, Región de La Araucanía.
              <br />
              Todos los derechos reservados.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-inline-block text-start border-start border-success border-3 ps-3">
              <span className="badge bg-success-subtle text-success mb-2">
                DSY1104 – 2026
              </span>
              <h6 className="fw-bold text-dark mb-1">Equipo: Colo Colo</h6>
              <p className="text-muted small mb-0">
                <strong>Integrantes:</strong> Ignacio Battistoni, Lucas Ortiz,
                Cristopher Rojas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
