import { type JSX } from "react";

interface TestimonialCardProps {
  quote: string;
  initials: string;
  name: string;
  category: string;
}

export default function TestimonialCard({
  quote,
  initials,
  name,
  category,
}: TestimonialCardProps): JSX.Element {
  return (
    <div className="col">
      <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
        <div className="card-body d-flex flex-column">
          <div className="text-warning mb-3 fs-5">⭐⭐⭐⭐⭐</div>
          <p className="card-text text-muted mb-4 flex-grow-1">"{quote}"</p>
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
              style={{ width: "45px", height: "45px" }}
            >
              {initials}
            </div>
            <div>
              <h6 className="mb-0 fw-bold text-dark">{name}</h6>
              <small className="text-success fw-semibold">{category}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
