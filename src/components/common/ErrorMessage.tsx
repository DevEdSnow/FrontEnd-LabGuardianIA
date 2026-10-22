import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  X,
  type LucideIcon,
} from "lucide-react";

export type ErrorMessageVariant = "error" | "warning" | "info";
export type ErrorMessageSize = "sm" | "md" | "lg";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  description?: string;
  variant?: ErrorMessageVariant;
  size?: ErrorMessageSize;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  dismissible?: boolean;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

const variantIcons: Record<ErrorMessageVariant, LucideIcon> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: AlertCircle,
};

export default function ErrorMessage({
  title = "Ha ocurrido un error",
  message,
  description,
  variant = "error",
  size = "md",
  onRetry,
  onDismiss,
  retryLabel = "Intentar de nuevo",
  dismissible = false,
  icon,
  action,
  className = "",
}: ErrorMessageProps) {
  const Icon = icon ?? variantIcons[variant];
  const content = description ?? message;

  return (
    <div
      className={[
        "error-message",
        `error-message--${variant}`,
        `error-message--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <div className="error-message__icon" aria-hidden="true">
        <Icon size={size === "sm" ? 17 : size === "lg" ? 25 : 21} />
      </div>

      <div className="error-message__content">
        <h4 className="error-message__title">{title}</h4>

        {content && (
          <p className="error-message__description">{content}</p>
        )}

        {(onRetry || action) && (
          <div className="error-message__actions">
            {action}

            {onRetry && (
              <button
                type="button"
                className="error-message__retry"
                onClick={onRetry}
              >
                <RefreshCw size={15} aria-hidden="true" />
                <span>{retryLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {(dismissible || onDismiss) && (
        <button
          type="button"
          className="error-message__dismiss"
          onClick={onDismiss}
          aria-label="Cerrar mensaje de error"
          title="Cerrar"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}