import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ClipboardList,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  QrCode,
  Settings,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "GENERAL",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        end: true,
      },
      {
        label: "Muestras",
        path: "/samples",
        icon: FlaskConical,
      },
      {
        label: "Alertas",
        path: "/alerts",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "MONITOREO",
    items: [
      {
        label: "Trazabilidad",
        path: "/traceability",
        icon: Activity,
      },
      {
        label: "Análisis de riesgos",
        path: "/risk-analysis",
        icon: BarChart3,
      },
      {
        label: "Equipos",
        path: "/equipment",
        icon: Gauge,
      },
    ],
  },
  {
    title: "HERRAMIENTAS",
    items: [
      {
        label: "Escáner QR",
        path: "/qr-scanner",
        icon: QrCode,
      },
      {
        label: "Registro de actividad",
        path: "/activity",
        icon: ClipboardList,
      },
    ],
  },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="sidebar-content">
      {/* Marca */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <ShieldCheck size={25} strokeWidth={2.2} />
        </div>

        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">LabGuardian</span>
          <span className="sidebar-brand-subtitle">INTELLIGENT LAB SYSTEM</span>
        </div>
      </div>

      {/* Estado del laboratorio */}
      <div className="sidebar-system-card">
        <div className="sidebar-system-icon">
          <FlaskConical size={19} />
        </div>

        <div className="sidebar-system-info">
          <span className="sidebar-system-title">Laboratorio</span>
          <span className="sidebar-system-description">
            Gestión inteligente
          </span>
        </div>

        <span
          className="sidebar-system-indicator"
          aria-label="Indicador visual del sistema"
          title="Indicador visual"
        />
      </div>

      {/* Navegación */}
      <nav className="sidebar-navigation" aria-label="Navegación principal">
        {navigationGroups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <h2 className="sidebar-group-title">{group.title}</h2>

            <ul className="sidebar-menu">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <li className="sidebar-menu-item" key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `sidebar-link${isActive ? " sidebar-link-active" : ""}`
                      }
                    >
                      <Icon
                        className="sidebar-link-icon"
                        size={19}
                        strokeWidth={1.9}
                      />

                      <span className="sidebar-link-label">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="sidebar-link-badge">
                          {item.badge}
                        </span>
                      )}

                      <ChevronLeft
                        className="sidebar-link-indicator"
                        size={15}
                        aria-hidden="true"
                      />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Acceso a configuración */}
      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            `sidebar-link sidebar-settings-link${
              isActive ? " sidebar-link-active" : ""
            }`
          }
        >
          <Settings size={19} strokeWidth={1.9} />
          <span className="sidebar-link-label">Configuración</span>
        </NavLink>

        <div className="sidebar-version">
          <div className="sidebar-version-icon">
            <ShieldCheck size={17} />
          </div>

          <div className="sidebar-version-info">
            <span className="sidebar-version-name">LabGuardian AI</span>
            <span className="sidebar-version-number">Sistema de laboratorio</span>
          </div>
        </div>
      </div>
    </div>
  );
}