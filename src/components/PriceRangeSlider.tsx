import type { JSX } from "react";
import { formatPriceCLP } from "../utils/formatPriceCLP";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (nextMin: number, nextMax: number) => void;
  onReset?: () => void;
}

export default function PriceRangeSlider({
  min,
  max,
  step = 1000,
  valueMin,
  valueMax,
  onChange,
  onReset,
}: PriceRangeSliderProps): JSX.Element | null {
  if (max <= min) return null;

  const span = max - min;
  const minPercent = ((valueMin - min) / span) * 100;
  const maxPercent = ((valueMax - min) / span) * 100;
  const isFiltered = valueMin > min || valueMax < max;
  const bringMinToFront = valueMin >= max - step;

  return (
    <div className="price-range-wrapper">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <span className="form-label small fw-bold text-uppercase text-muted mb-0">
          Rango de precio
        </span>
        <div className="d-flex align-items-center gap-2">
          <span
            className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold"
            aria-live="polite"
          >
            {formatPriceCLP(valueMin)} — {formatPriceCLP(valueMax)}
          </span>
          {isFiltered && onReset && (
            <button
              type="button"
              className="btn btn-link btn-sm text-muted text-decoration-none p-0 fw-semibold"
              onClick={onReset}
              aria-label="Restablecer rango de precio"
            >
              Restablecer
            </button>
          )}
        </div>
      </div>

      <div className="price-range-slider">
        <div className="price-range-track" aria-hidden="true" />
        <div
          className="price-range-fill"
          aria-hidden="true"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const nextMin = Math.min(Number(e.target.value), valueMax);
            onChange(nextMin, valueMax);
          }}
          className="price-range-input"
          style={{ zIndex: bringMinToFront ? 4 : 3 }}
          aria-label="Precio mínimo"
          aria-valuetext={formatPriceCLP(valueMin)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const nextMax = Math.max(Number(e.target.value), valueMin);
            onChange(valueMin, nextMax);
          }}
          className="price-range-input"
          style={{ zIndex: bringMinToFront ? 3 : 4 }}
          aria-label="Precio máximo"
          aria-valuetext={formatPriceCLP(valueMax)}
        />
      </div>

      <div
        className="d-flex justify-content-between text-muted mt-1"
        style={{ fontSize: "0.75rem" }}
      >
        <span>{formatPriceCLP(min)}</span>
        <span>{formatPriceCLP(max)}</span>
      </div>
    </div>
  );
}
