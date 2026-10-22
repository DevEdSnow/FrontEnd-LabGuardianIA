import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  FlaskConical,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AlertDetailData } from "./AlertDetails";
import AlertStatusBadge from "./AlertStatusBadge";

type SortField = "severity" | "title" | "sample_code" | "created_at";
type SortDirection = "asc" | "desc";

interface AlertTableProps {
  alerts: AlertDetailData[];
  loading?: boolean;
  error?: string | null;
  onView?: (alert: AlertDetailData) => void;
  onAcknowledge?: (alert: AlertDetailData) => void;
  onResolve?: (alert: AlertDetailData) => void;
  onRefresh?: () => void;
  processingAlertId?: number | null;
  emptyMessage?: string;
}

const severityConfig: Record<
  string,
  { label: string; className: string; order: number }
> = {
  critical: {
    label: "Crítica",
    className: "alert-severity-critical",
    order: 4,
  },
  high: {
    label: "Alta",
    className: "alert-severity-high",
    order: 3,
  },
  medium: {
    label: "Media",
    className: "alert-severity-medium",
    order: 2,
  },
  low: {
    label: "Baja",
    className: "alert-severity-low",
    order: 1,
  },
};

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function getSeverity(severity: string | null | undefined) {
  const key = normalize(severity);

  return (
    severityConfig[key] ?? {
      label: severity?.trim() || "Sin clasificar",
      className: "alert-severity-unknown",
      order: 0,
    }
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getInitials(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function AlertTable({
  alerts,
  loading = false,
  error = null,
  onView,
  onAcknowledge,
  onResolve,
  onRefresh,
  processingAlertId = null,
  emptyMessage = "No se encontraron alertas con los filtros seleccionados.",
}: AlertTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  const sortedAlerts = useMemo(() => {
    return [...alerts].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "severity": {
          const severityA = getSeverity(a.severity).order;
          const severityB = getSeverity(b.severity).order;
          comparison = severityA - severityB;
          break;
        }

        case "title":
          comparison = (a.title ?? "").localeCompare(b.title ?? "", "es");
          break;

        case "sample_code":
          comparison = (a.sample_code ?? "").localeCompare(
            b.sample_code ?? "",
            "es",
          );
          break;

        case "created_at": {
          const dateA = new Date(a.created_at).getTime() || 0;
          const dateB = new Date(b.created_at).getTime() || 0;
          comparison = dateA - dateB;
          break;
        }
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [alerts, sortField, sortDirection]);

  const changeSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );
      return;
    }

    setSortField(field);
    setSortDirection(field === "created_at" ? "desc" : "asc");
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} aria-hidden="true" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp size={14} aria-hidden="true" />
    ) : (
      <ArrowDown size={14} aria-hidden="true" />
    );
  };

  const isActionable = (status: string) =>
    ["active", "acknowledged"].includes(normalize(status));

  return (
    <section className="alert-table-card" aria-label="Tabla de alertas">
      <div className="alert-table-header">
        <div className="alert-table-heading">
          <div className="alert-table-heading-icon">
            <ShieldCheck size={19} aria-hidden="true" />
          </div>

          <div>
            <h2 className="alert-table-title">Listado de alertas</h2>
            <p className="alert-table-description">
              Consulta y administra las incidencias detectadas.
            </p>
          </div>
        </div>

        <div className="alert-table-header-actions">
          <span className="alert-table-total">
            {alerts.length} {alerts.length === 1 ? "alerta" : "alertas"}
          </span>

          {onRefresh && (
            <button
              type="button"
              className="alert-table-refresh"
              onClick={onRefresh}
              disabled={loading}
              aria-label="Actualizar listado de alertas"
              title="Actualizar"
            >
              <RefreshCw
                size={16}
                className={loading ? "alert-table-spin" : ""}
                aria-hidden="true"
              />
              <span>Actualizar</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert-table-error" role="alert">
          <span>{error}</span>

          {onRefresh && (
            <button type="button" onClick={onRefresh}>
              Reintentar
            </button>
          )}
        </div>
      )}

      <div className="alert-table-scroll">
        <table className="alert-table">
          <thead>
            <tr>
              <th scope="col">
                <button
                  type="button"
                  className="alert-table-sort"
                  onClick={() => changeSort("severity")}
                >
                  Severidad
                  {renderSortIcon("severity")}
                </button>
              </th>

              <th scope="col">
                <button
                  type="button"
                  className="alert-table-sort"
                  onClick={() => changeSort("title")}
                >
                  Alerta
                  {renderSortIcon("title")}
                </button>
              </th>

              <th scope="col">
                <button
                  type="button"
                  className="alert-table-sort"
                  onClick={() => changeSort("sample_code")}
                >
                  Muestra
                  {renderSortIcon("sample_code")}
                </button>
              </th>

              <th scope="col">Riesgo</th>

              <th scope="col">
                <button
                  type="button"
                  className="alert-table-sort"
                  onClick={() => changeSort("created_at")}
                >
                  Fecha
                  {renderSortIcon("created_at")}
                </button>
              </th>

              <th scope="col">Estado</th>
              <th scope="col" className="alert-table-actions-heading">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`alert-skeleton-${index}`}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex}>
                      <span className="alert-table-skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedAlerts.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="alert-table-empty">
                    <div className="alert-table-empty-icon">
                      <CheckCircle2 size={28} aria-hidden="true" />
                    </div>

                    <h3>Todo en orden</h3>
                    <p>{emptyMessage}</p>

                    {onRefresh && (
                      <button
                        type="button"
                        className="alert-table-empty-button"
                        onClick={onRefresh}
                      >
                        <RefreshCw size={15} aria-hidden="true" />
                        Actualizar listado
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedAlerts.map((alert) => {
                const severity = getSeverity(alert.severity);
                const busy = processingAlertId === alert.id;
                const canAct = isActionable(alert.status);
                const sampleCode = alert.sample_code?.trim();

                return (
                  <tr
                    key={alert.id}
                    className={
                      normalize(alert.severity) === "critical"
                        ? "alert-table-row-critical"
                        : ""
                    }
                  >
                    <td>
                      <span
                        className={`alert-severity-badge ${severity.className}`}
                      >
                        <span className="alert-severity-dot" />
                        {severity.label}
                      </span>
                    </td>

                    <td>
                      <div className="alert-table-alert-cell">
                        <span
                          className={`alert-table-alert-indicator ${
                            severity.className
                          }`}
                          aria-hidden="true"
                        />

                        <div className="alert-table-alert-content">
                          <span
                            className="alert-table-alert-title"
                            title={alert.title}
                          >
                            {alert.title || "Alerta sin título"}
                          </span>

                          <span
                            className="alert-table-alert-message"
                            title={alert.message}
                          >
                            {alert.message || "Sin descripción disponible"}
                          </span>

                          <span className="alert-table-id">
                            ID de alerta: #{alert.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {sampleCode && alert.sample_id != null ? (
                        <button
                          type="button"
                          className="alert-table-sample"
                          onClick={() => onView?.(alert)}
                          title={`Ver detalles de la alerta ${sampleCode}`}
                        >
                          <span className="alert-table-sample-icon">
                            <FlaskConical size={15} aria-hidden="true" />
                          </span>
                          <span>{sampleCode}</span>
                        </button>
                      ) : sampleCode ? (
                        <span className="alert-table-sample-text">
                          <FlaskConical size={14} aria-hidden="true" />
                          {sampleCode}
                        </span>
                      ) : (
                        <span className="alert-table-muted">Sin muestra</span>
                      )}
                    </td>

                    <td>
                      <div className="alert-table-risk">
                        <span className="alert-table-risk-value">
                          {alert.risk_score != null
                            ? `${Math.round(alert.risk_score)}%`
                            : "—"}
                        </span>

                        {alert.risk_score != null && (
                          <span
                            className="alert-table-risk-track"
                            role="progressbar"
                            aria-label={`Riesgo de alerta ${alert.id}`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.max(
                              0,
                              Math.min(100, alert.risk_score),
                            )}
                          >
                            <span
                              className={`alert-table-risk-fill ${severity.className}`}
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, alert.risk_score),
                                )}%`,
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="alert-table-date">
                        <span>{formatDate(alert.created_at)}</span>
                        <span className="alert-table-date-caption">
                          <Clock3 size={12} aria-hidden="true" />
                          Registrada
                        </span>
                      </div>
                    </td>

                    <td>
                      <AlertStatusBadge status={alert.status} size="sm" />
                    </td>

                    <td>
                      <div className="alert-table-actions">
                        <button
                          type="button"
                          className="alert-table-action alert-table-action-view"
                          onClick={() => onView?.(alert)}
                          disabled={!onView || busy}
                          title="Ver detalles"
                          aria-label={`Ver alerta ${alert.id}`}
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>

                        {normalize(alert.status) === "active" &&
                          onAcknowledge && (
                            <button
                              type="button"
                              className="alert-table-action alert-table-action-acknowledge"
                              onClick={() => onAcknowledge(alert)}
                              disabled={busy || loading}
                              title="Reconocer alerta"
                              aria-label={`Reconocer alerta ${alert.id}`}
                            >
                              {busy ? (
                                <RefreshCw
                                  size={15}
                                  className="alert-table-spin"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Check size={16} aria-hidden="true" />
                              )}
                            </button>
                          )}

                        {canAct && onResolve && (
                          <button
                            type="button"
                            className="alert-table-action alert-table-action-resolve"
                            onClick={() => onResolve(alert)}
                            disabled={busy || loading}
                            title="Resolver alerta"
                            aria-label={`Resolver alerta ${alert.id}`}
                          >
                            <CheckCircle2 size={16} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="alert-table-footer">
        <span>
          {loading
            ? "Cargando alertas…"
            : `Mostrando ${sortedAlerts.length} de ${alerts.length} alertas`}
        </span>

        <span className="alert-table-footer-status">
          <span className="alert-table-footer-dot" />
          Datos del sistema
        </span>
      </div>
    </section>
  );
}