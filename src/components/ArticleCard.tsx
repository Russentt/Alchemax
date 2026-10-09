import { type JSX } from "react";
import { Link } from "react-router";

interface ArticleCardProps {
  theme: "success" | "info" | "warning";
  badgeText: string;
  title: string;
  description: string;
  readTime: number;
  linkTo: string;
}

export default function ArticleCard({
  theme,
  badgeText,
  title,
  description,
  readTime,
  linkTo,
}: ArticleCardProps): JSX.Element {
  const themeClasses = {
    success: "bg-success-subtle text-success",
    info: "bg-info-subtle text-info",
    warning: "bg-warning-subtle text-dark",
  };

  return (
    <div className="col">
      <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-2">
        <div className="card-body d-flex flex-column p-4">
          <span
            className={`badge ${themeClasses[theme]} align-self-start mb-3 px-3 py-1 rounded-pill`}
          >
            {badgeText}
          </span>
          <h4 className="card-title fw-bold text-dark mb-3">{title}</h4>
          <p className="card-text text-muted small flex-grow-1 mb-4">
            {description}
          </p>
          <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-auto">
            <small className="text-muted">{readTime} min de lectura</small>
            <Link
              to={linkTo}
              className="text-success fw-bold text-decoration-none small"
            >
              Leer más →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
