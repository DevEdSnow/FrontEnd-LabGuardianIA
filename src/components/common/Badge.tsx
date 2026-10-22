import type { ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
  title?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className = "",
  title,
}: BadgeProps) {
  const classes = [
    "badge",
    `badge--${variant}`,
    `badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} title={title}>
      {dot && <span className="badge__dot" aria-hidden="true" />}

      {icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="badge__label">{children}</span>
    </span>
  );
}