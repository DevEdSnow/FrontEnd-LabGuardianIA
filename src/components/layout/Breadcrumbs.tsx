
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  samples: "Muestras",
  alerts: "Alertas",
  traceability: "Trazabilidad",
  "risk-analysis": "Análisis de riesgos",
  equipment: "Equipos",
  "qr-scanner": "Escáner QR",
  settings: "Configuración",
};

function formatSegment(segment: string): string {
  if (routeLabels[segment]) {
    return routeLabels[segment];
  }

  if (/^\d+$/.test(segment)) {
    return `Muestra #${segment}`;
  }

  return decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Breadcrumbs() {
  const location = useLocation();

  const segments = location.pathname
    .split("/")
    .filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Inicio",
      path: "/",
    },
  ];

  let currentPath = "";

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    breadcrumbs.push({
      label: formatSegment(segment),
      path: currentPath,
    });
  });

  return (
    <nav
      className="breadcrumbs"
      aria-label="Ruta de navegación"
    >
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isHome = index === 0;

          return (
            <li
              className="breadcrumbs-item"
              key={item.path}
            >
              {index > 0 && (
                <ChevronRight
                  size={15}
                  className="breadcrumbs-separator"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="breadcrumbs-current"
                  aria-current="page"
                >
                  {isHome && (
                    <Home
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="breadcrumbs-link"
                >
                  {isHome && (
                    <Home
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
