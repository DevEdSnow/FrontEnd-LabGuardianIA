
import { useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  CheckCheck,
} from "lucide-react";

import Breadcrumbs from "./Breadcrumbs";

export default function Header() {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Riesgo crítico detectado",
      description: "Una muestra requiere revisión inmediata.",
      time: "Requiere atención",
      type: "critical",
    },
    {
      id: 2,
      title: "Temperatura fuera de rango",
      description: "Se detectó una desviación en el almacenamiento.",
      time: "Requiere revisión",
      type: "warning",
    },
  ];

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    // La búsqueda se conectará con las muestras y alertas de la API.
    console.info("Búsqueda solicitada:", query);
  }

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-search-container">
          <form className="header-search" onSubmit={handleSearch}>
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar muestras, alertas..."
              aria-label="Buscar muestras y alertas"
            />

            <kbd className="search-shortcut">Buscar</kbd>
          </form>
        </div>

        <div className="header-actions">
          <div className="header-system-status">
            <span className="system-status-dot" />
            <span>Sistema operativo</span>
          </div>

          <div className="header-dropdown-container">
            <button
              type="button"
              className={`header-icon-button ${
                showNotifications ? "is-active" : ""
              }`}
              aria-label="Mostrar notificaciones"
              aria-expanded={showNotifications}
              onClick={() => {
                setShowNotifications((visible) => !visible);
                setShowProfile(false);
              }}
            >
              <Bell size={20} />
              <span className="notification-indicator" />
            </button>

            {showNotifications && (
              <div className="header-dropdown notifications-dropdown">
                <div className="dropdown-heading">
                  <div>
                    <h3>Notificaciones</h3>
                    <p>Eventos que requieren atención</p>
                  </div>

                  <CheckCheck size={19} />
                </div>

                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      className="notification-item"
                      key={notification.id}
                    >
                      <span
                        className={`notification-dot ${notification.type}`}
                      />

                      <div className="notification-content">
                        <p className="notification-title">
                          {notification.title}
                        </p>

                        <p className="notification-description">
                          {notification.description}
                        </p>

                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="dropdown-note">
                  Vista de demostración. Las notificaciones reales se
                  conectarán con el backend.
                </p>
              </div>
            )}
          </div>

          <div className="header-dropdown-container">
            <button
              type="button"
              className={`header-profile ${
                showProfile ? "is-active" : ""
              }`}
              aria-expanded={showProfile}
              aria-label="Abrir menú del usuario"
              onClick={() => {
                setShowProfile((visible) => !visible);
                setShowNotifications(false);
              }}
            >
              <span className="profile-avatar">
                <UserRound size={21} />
              </span>

              <span className="profile-information">
                <span className="profile-name">Administrador</span>
                <span className="profile-role">Laboratorio</span>
              </span>

              <ChevronDown size={16} />
            </button>

            {showProfile && (
              <div className="header-dropdown profile-dropdown">
                <div className="profile-dropdown-heading">
                  <span className="profile-avatar">
                    <UserRound size={21} />
                  </span>

                  <div>
                    <strong>Administrador</strong>
                    <span>LabGuardian AI</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowProfile(false);
                    window.location.href = "/settings";
                  }}
                >
                  <Settings size={17} />
                  <span>Configuración</span>
                </button>

                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowProfile(false);
                    console.info(
                      "La autenticación todavía no está configurada.",
                    );
                  }}
                >
                  <LogOut size={17} />
                  <span>Cerrar sesión</span>
                </button>

                <p className="dropdown-note">
                  La autenticación se integrará posteriormente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-page-navigation">
        <Breadcrumbs />
      </div>
    </header>
  );
}
