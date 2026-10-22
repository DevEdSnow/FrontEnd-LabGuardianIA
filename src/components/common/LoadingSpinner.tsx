import type { CSSProperties } from "react";
import { LoaderCircle } from "lucide-react";

export type LoadingSpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoadingSpinnerVariant = "primary" | "secondary" | "white";

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  centered?: boolean;
  className?: string;
  label?: string;
}

const sizeValues: Record<LoadingSpinnerSize, number> = {
  xs: 14,
  sm: 18,
  md: 26,
  lg: 36,
  xl: 48,
};

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  text,
  fullScreen = false,
  overlay = false,
  centered = true,
  className = "",
  label = "Cargando",
}: LoadingSpinnerProps) {
  const spinnerStyle = {
    "--spinner-size": `${sizeValues[size]}px`,
  } as CSSProperties;

  const classes = [
    "loading-spinner",
    `loading-spinner--${size}`,
    `loading-spinner--${variant}`,
    centered ? "loading-spinner--centered" : "",
    fullScreen ? "loading-spinner--fullscreen" : "",
    overlay ? "loading-spinner--overlay" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={spinnerStyle}
      role="status"
      aria-live="polite"
      aria-label={text ? undefined : label}
    >
      <LoaderCircle
        className="loading-spinner__icon"
        size={sizeValues[size]}
        strokeWidth={2.5}
        aria-hidden="true"
      />

      {text && (
        <span className="loading-spinner__text">
          {text}
        </span>
      )}

      <span className="loading-spinner__sr-only">
        {text || label}
      </span>
    </div>
  );
}