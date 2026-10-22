import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "default" | "outlined" | "elevated";

export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  description?: string;
  headerIcon?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  noHeaderBorder?: boolean;
  noBodyPadding?: boolean;
}

export default function Card({
  children,
  title,
  description,
  headerIcon,
  actions,
  footer,
  variant = "default",
  padding = "md",
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  noHeaderBorder = false,
  noBodyPadding = false,
  ...props
}: CardProps) {
  const hasHeader = Boolean(
    title || description || headerIcon || actions,
  );

  const cardClasses = [
    "common-card",
    `common-card--${variant}`,
    `common-card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headerClasses = [
    "common-card__header",
    noHeaderBorder ? "common-card__header--no-border" : "",
    headerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const bodyClasses = [
    "common-card__body",
    noBodyPadding ? "common-card__body--no-padding" : "",
    bodyClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const footerClasses = [
    "common-card__footer",
    footerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cardClasses} {...props}>
      {hasHeader && (
        <header className={headerClasses}>
          <div className="common-card__heading">
            {headerIcon && (
              <span className="common-card__header-icon" aria-hidden="true">
                {headerIcon}
              </span>
            )}

            <div className="common-card__heading-text">
              {title && (
                <h2 className="common-card__title">{title}</h2>
              )}

              {description && (
                <p className="common-card__description">
                  {description}
                </p>
              )}
            </div>
          </div>

          {actions && (
            <div className="common-card__actions">
              {actions}
            </div>
          )}
        </header>
      )}

      <div className={bodyClasses}>{children}</div>

      {footer && (
        <footer className={footerClasses}>{footer}</footer>
      )}
    </section>
  );
}