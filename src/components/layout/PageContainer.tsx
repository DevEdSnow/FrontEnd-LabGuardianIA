
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
  className?: string;
}

export default function PageContainer({
  title,
  description,
  children,
  actions,
  eyebrow,
  className = "",
}: PageContainerProps) {
  return (
    <section className={`page-container ${className}`.trim()}>
      <div className="page-container-heading">
        <div className="page-container-heading-content">
          {eyebrow && (
            <div className="page-container-eyebrow">
              <span className="page-container-eyebrow-dot" />
              {eyebrow}
            </div>
          )}

          <h1 className="page-container-title">{title}</h1>

          {description && (
            <p className="page-container-description">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="page-container-actions">
            {actions}
          </div>
        )}
      </div>

      <div className="page-container-content">
        {children}
      </div>

      <div className="page-container-bottom" aria-hidden="true">
        <span />
        <ChevronRight size={14} />
      </div>
    </section>
  );
}
