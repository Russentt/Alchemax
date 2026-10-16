import { type CSSProperties, type JSX, type ReactNode } from "react";

interface AccountSummaryCardProps {
  icon: string;
  label: string;
  value: ReactNode;
  description: ReactNode;
  onClick: () => void;
  labelClassName?: string;
  descriptionClassName?: string;
  style?: CSSProperties;
}

export default function AccountSummaryCard({
  icon,
  label,
  value,
  description,
  onClick,
  labelClassName = "text-dark fw-bold small text-uppercase tracking-tight opacity-75 mb-2",
  descriptionClassName = "text-muted small mb-0",
  style,
}: AccountSummaryCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      style={{ cursor: "pointer", ...style }}
      className="glass-panel-small p-4 rounded-5 h-100 border-0 hover-lift position-relative overflow-hidden"
    >
      <div className="position-absolute top-0 end-0 p-3 opacity-25 fs-1">
        {icon}
      </div>
      <p className={labelClassName}>{label}</p>
      <h4 className="fw-bolder text-dark mb-1 tracking-tight">{value}</h4>
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
}
