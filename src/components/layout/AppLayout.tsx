import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  const openSidebar = () => setSidebarOpen(true);

  // Cerrar el menú móvil cuando cambia la ruta.
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  // Permitir cerrar el menú con la tecla Escape.
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="app-layout">
      {/* Fondo para cerrar el menú móvil */}
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Cerrar menú de navegación"
          onClick={closeSidebar}
        />
      )}

      {/* Navegación lateral */}
      <aside
        id="main-sidebar"
        className={`app-sidebar ${
          sidebarOpen ? "app-sidebar-open" : ""
        }`}
        aria-label="Menú principal"
      >
        {/* Cabecera exclusiva para móviles */}
        <div className="mobile-sidebar-header">
          <span className="mobile-sidebar-title">
            LabGuardian AI
          </span>

          <button
            type="button"
            className="icon-button mobile-close-button"
            onClick={closeSidebar}
            aria-label="Cerrar menú de navegación"
          >
            <X size={21} />
          </button>
        </div>

        <Sidebar onNavigate={closeSidebar} />
      </aside>

      {/* Contenido principal */}
      <div className="app-main">
        {/* Cabecera móvil */}
        <div className="app-mobile-header">
          <button
            type="button"
            className="icon-button mobile-menu-button"
            onClick={openSidebar}
            aria-label="Abrir menú de navegación"
            aria-controls="main-sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu size={23} />
          </button>

          <span className="app-mobile-brand">
            LabGuardian AI
          </span>
        </div>

        {/* Barra superior y breadcrumbs */}
        <Header />

        {/* Página activa según la ruta */}
        <main className="app-content">
          <div className="app-content-inner">
            <Outlet />
          </div>
        </main>

        {/* Pie de página */}
        <footer className="app-footer">
          <span>
            © {new Date().getFullYear()} LabGuardian AI
          </span>

          <span className="app-footer-status">
            Sistema de trazabilidad de laboratorio
          </span>
        </footer>
      </div>
    </div>
  );
}