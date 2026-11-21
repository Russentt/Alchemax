import { type JSX } from "react";

interface AdminStatCardProps {
  title: string;
  value: number | string;
  icon: string;
  theme: "success" | "primary" | "warning" | "danger" | "info";
  subtitle?: string;
}

export default function AdminStatCard({
  title,
  value,
  icon,
  theme,
  subtitle,
}: AdminStatCardProps): JSX.Element {
  
  // Mapeo de colores para la consola oscura
  const colorMap = {
    success: "#10b981",
    primary: "#3b82f6",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#0ea5e9"
  };

  const activeColor = colorMap[theme];

  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div
        className="p-4 rounded-4 shadow-sm border-0 h-100 position-relative overflow-hidden"
        style={{ 
          background: "linear-gradient(145deg, #1f2937 0%, #111827 100%)",
          borderLeft: `4px solid ${activeColor}`,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0 fw-bold small text-uppercase tracking-tight" style={{ color: '#9ca3af', letterSpacing: '0.05em' }}>
            {title}
          </p>
          <span className="fs-4 opacity-75" aria-hidden="true">{icon}</span>
        </div>
        <h3 className="fw-bolder mb-1" style={{ color: '#f3f4f6', fontFamily: 'monospace', fontSize: '1.75rem' }}>
          {value}
        </h3>
        {subtitle && (
          <p className="mb-0 small font-monospace" style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
            {subtitle}
          </p>
        )}
        {/* Glow effect */}
        <div 
          className="position-absolute top-0 end-0 rounded-circle" 
          style={{ 
            width: '100px', 
            height: '100px', 
            background: `radial-gradient(circle, ${activeColor}20 0%, transparent 70%)`,
            transform: 'translate(30%, -30%)'
          }}
        />
      </div>
    </div>
  );
}