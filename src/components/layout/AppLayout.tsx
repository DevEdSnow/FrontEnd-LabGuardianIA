
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Fondo para cerrar el menú en dispositivos móviles */}
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
        className={`app-sidebar ${sidebarOpen ? "app-sidebar-open" : ""}`}
      >
        <div className="mobile-sidebar-header">
          <span className="mobile-sidebar-title">LabGuardian AI</span>

          <button
            type="button"
            className="icon-button mobile-close-button"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            <X size={21} />
          </button>
        </div>

        <Sidebar onNavigate={closeSidebar} />
      </aside>

      {/* Área principal */}
      <div className="app-main">
        <div className="app-mobile-header">
          <button
            type="button"
            className="icon-button mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={sidebarOpen}
          >
            <Menu size={23} />
          </button>

          <span className="app-mobile-brand">LabGuardian AI</span>
        </div>

        <Header />

        <main className="app-content">
          <div className="app-content-inner">
            <Outlet />
          </div>
        </main>

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
