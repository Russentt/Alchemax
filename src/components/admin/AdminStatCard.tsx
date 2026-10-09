import { type JSX } from "react";

interface AdminStatCardProps {
  title: string;
  value: number;
  icon: string;
  theme: "success" | "primary" | "warning" | "danger" | "info";
}

export default function AdminStatCard({
  title,
  value,
  icon,
  theme,
}: AdminStatCardProps): JSX.Element {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div
        className={`bg-white p-4 rounded-4 shadow-sm border-0 border-start border-4 border-${theme} h-100`}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="text-muted mb-0 fw-semibold small text-uppercase">
            {title}
          </p>
          <span className="fs-4">{icon}</span>
        </div>
        <h3 className="fw-bold text-dark mb-0">{value}</h3>
      </div>
    </div>
  );
}
