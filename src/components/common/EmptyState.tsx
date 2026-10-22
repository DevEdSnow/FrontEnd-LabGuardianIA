import type { ReactNode } from "react";
import {
  FileSearch,
  type LucideIcon,
} from "lucide-react";

export type EmptyStateVariant =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error";

export type EmptyStateSize = "sm" | "md" | "lg";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  illustration?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = FileSearch,
  variant = "default",
  size = "md",
  action,
  secondaryAction,
  illustration,
  className = "",
}: EmptyStateProps) {
  const classes = [
    "empty-state",
    `empty-state--${variant}`,
    `empty-state--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} aria-label={title}>
      <div className="empty-state__illustration">
        {illustration ?? (
          <Icon
            className="empty-state__icon"
            size={size === "sm" ? 24 : size === "lg" ? 36 : 30}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="empty-state__content">
        <h3 className="empty-state__title">{title}</h3>

        {description && (
          <p className="empty-state__description">{description}</p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="empty-state__actions">
          {action && (
            <div className="empty-state__primary-action">{action}</div>
          )}

          {secondaryAction && (
            <div className="empty-state__secondary-action">
              {secondaryAction}
            </div>
          )}
        </div>
      )}
    </section>
  );
}