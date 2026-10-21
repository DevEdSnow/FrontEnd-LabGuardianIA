import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FlaskConical,
  Gauge,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Thermometer,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type AlertStatus =
  | "active"
  | "acknowledged"
  | "resolved";

export interface AlertDetailData {
  id: number;
  sample_id: number | null;
  sample_code: string | null;
  event_id: number | null;
  alert_type: string;
  severity: AlertSeverity | string;
  status: AlertStatus | string;
  title: string;
  message: string;
  risk_score: number | null;
  source: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
}

interface AlertDetailProps {
  alert: AlertDetailData;
  onAcknowledge?: (alertId: number) => void | Promise<void>;
  onResolve?: (alertId: number) => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const severityConfig: Record<
  string,
  { label: string; className: string }
> = {
  low: {
    label: "Baja",
    className: "alert-detail-severity-low",
  },
  medium: {
    label: "Media",
    className: "alert-detail-severity-medium",
  },
  high: {
    label: "Alta",
    className: "alert-detail-severity-high",
  },
  critical: {
    label: "Crítica",
    className: "alert-detail-severity-critical",
  },
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: "Activa",
    className: "alert-detail-status-active",
  },
  acknowledged: {
    label: "Reconocida",
    className: "alert-detail-status-acknowledged",
  },
  resolved: {
    label: "Resuelta",
    className: "alert-detail-status-resolved",
  },
};

function formatLabel(value: string | null | undefined): string {
  if (!value) return "No disponible";

  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "No disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="alert-detail-item">
      <div className="alert-detail-item-icon">
        <Icon size={18} />
      </div>

      <div className="alert-detail-item-content">
        <span className="alert-detail-item-label">{label}</span>
        <span className="alert-detail-item-value">{value}</span>
      </div>
    </div>
  );
}

export default function AlertDetail({
  alert,
  onAcknowledge,
  onResolve,
  onRefresh,
  loading = false,
  error = null,
}: AlertDetailProps) {
  const navigate = useNavigate();

  const severity =
    severityConfig[alert.severity.toLowerCase()] ?? {
      label: formatLabel(alert.severity),
      className: "alert-detail-severity-default",
    };

  const status =
    statusConfig[alert.status.toLowerCase()] ?? {
      label: formatLabel(alert.status),
      className: "alert-detail-status-default",
    };

  const isActive = alert.status.toLowerCase() === "active";
  const isAcknowledged =
    alert.status.toLowerCase() === "acknowledged";
  const isResolved = alert.status.toLowerCase() === "resolved";

  const riskScore = alert.risk_score;
  const validRiskScore =
    riskScore !== null &&
    Number.isFinite(riskScore) &&
    riskScore >= 0 &&
    riskScore <= 100;

  return (
    <section className="alert-detail-page">
      {/* Navegación */}
      <div className="alert-detail-topbar">
        <button
          type="button"
          className="alert-detail-back"
          onClick={() => navigate("/alerts")}
        >
          <ArrowLeft size={18} />
          <span>Volver a alertas</span>
        </button>

        <button
          type="button"
          className="alert-detail-refresh"
          onClick={() => void onRefresh?.()}
          disabled={loading || !onRefresh}
        >
          <RefreshCw
            size={16}
            className={loading ? "alert-detail-spin" : ""}
          />
          Actualizar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert-detail-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* Encabezado */}
      <header className="alert-detail-heading">
        <div className="alert-detail-heading-icon">
          <ShieldAlert size={27} />
        </div>

        <div className="alert-detail-heading-content">
          <div className="alert-detail-eyebrow">
            ALERTA #{alert.id}
          </div>

          <h1 className="alert-detail-title">
            {alert.title || "Alerta sin título"}
          </h1>

          <p className="alert-detail-subtitle">
            Detalles, seguimiento y gestión de la alerta.
          </p>

          <div className="alert-detail-badges">
            <span
              className={`alert-detail-badge ${severity.className}`}
            >
              <AlertCircle size={14} />
              Severidad {severity.label}
            </span>

            <span
              className={`alert-detail-badge ${status.className}`}
            >
              {isResolved ? (
                <CheckCircle2 size={14} />
              ) : (
                <Activity size={14} />
              )}
              {status.label}
            </span>
          </div>
        </div>
      </header>

      {/* Resumen */}
      <div className="alert-detail-grid">
        <article className="alert-detail-card alert-detail-main-card">
          <div className="alert-detail-card-heading">
            <div className="alert-detail-card-heading-icon alert-detail-icon-red">
              <AlertCircle size={19} />
            </div>

            <div>
              <h2>Descripción de la alerta</h2>
              <p>Información registrada por el sistema</p>
            </div>
          </div>

          <div className="alert-detail-description">
            {alert.message || "No hay una descripción disponible."}
          </div>

          <div className="alert-detail-divider" />

          <div className="alert-detail-meta">
            <div>
              <span className="alert-detail-meta-label">
                Tipo de alerta
              </span>
              <span className="alert-detail-meta-value">
                {formatLabel(alert.alert_type)}
              </span>
            </div>

            <div>
              <span className="alert-detail-meta-label">
                Origen
              </span>
              <span className="alert-detail-meta-value">
                {formatLabel(alert.source)}
              </span>
            </div>

            <div>
              <span className="alert-detail-meta-label">
                Evento relacionado
              </span>
              <span className="alert-detail-meta-value">
                {alert.event_id === null
                  ? "Sin evento asociado"
                  : `Evento #${alert.event_id}`}
              </span>
            </div>
          </div>
        </article>

        {/* Nivel de riesgo */}
        <article className="alert-detail-card alert-detail-risk-card">
          <div className="alert-detail-card-heading">
            <div className="alert-detail-card-heading-icon alert-detail-icon-blue">
              <Gauge size={19} />
            </div>

            <div>
              <h2>Nivel de riesgo</h2>
              <p>Puntuación asociada a la alerta</p>
            </div>
          </div>

          {validRiskScore ? (
            <>
              <div className="alert-detail-risk-score">
                <span>{riskScore}</span>
                <span className="alert-detail-risk-max">/ 100</span>
              </div>

              <div
                className="alert-detail-risk-track"
                role="progressbar"
                aria-label="Puntuación de riesgo"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={riskScore}
              >
                <div
                  className={`alert-detail-risk-fill ${severity.className}`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>

              <p className="alert-detail-risk-caption">
                Puntuación registrada en la alerta.
              </p>
            </>
          ) : (
            <div className="alert-detail-empty">
              No hay una puntuación de riesgo disponible.
            </div>
          )}
        </article>

        {/* Muestra relacionada */}
        <article className="alert-detail-card">
          <div className="alert-detail-card-heading">
            <div className="alert-detail-card-heading-icon alert-detail-icon-teal">
              <FlaskConical size={19} />
            </div>

            <div>
              <h2>Muestra relacionada</h2>
              <p>Identificación de la muestra</p>
            </div>
          </div>

          <div className="alert-detail-sample-code">
            {alert.sample_code || "Sin muestra asociada"}
          </div>

          <div className="alert-detail-information-row">
            <span>ID de muestra</span>
            <strong>
              {alert.sample_id === null
                ? "No disponible"
                : `#${alert.sample_id}`}
            </strong>
          </div>

          {alert.sample_id !== null && (
            <button
              type="button"
              className="alert-detail-text-button"
              onClick={() => navigate(`/samples/${alert.sample_id}`)}
            >
              Consultar muestra
              <ArrowLeft size={15} />
            </button>
          )}
        </article>

        {/* Fechas */}
        <article className="alert-detail-card">
          <div className="alert-detail-card-heading">
            <div className="alert-detail-card-heading-icon alert-detail-icon-purple">
              <Calendar size={19} />
            </div>

            <div>
              <h2>Registro temporal</h2>
              <p>Fechas de seguimiento</p>
            </div>
          </div>

          <DetailItem
            icon={Clock}
            label="Creada"
            value={formatDate(alert.created_at)}
          />

          <DetailItem
            icon={RefreshCw}
            label="Última actualización"
            value={formatDate(alert.updated_at)}
          />

          {alert.acknowledged_at && (
            <DetailItem
              icon={User}
              label="Reconocida por"
              value={[
                alert.acknowledged_by || "Usuario no identificado",
                formatDate(alert.acknowledged_at),
              ].join(" · ")}
            />
          )}

          {alert.resolved_at && (
            <DetailItem
              icon={CheckCircle2}
              label="Resuelta"
              value={[
                alert.resolved_by || "Usuario no identificado",
                formatDate(alert.resolved_at),
              ].join(" · ")}
            />
          )}
        </article>

        {/* Resolución */}
        {isResolved && (
          <article className="alert-detail-card alert-detail-resolution-card">
            <div className="alert-detail-card-heading">
              <div className="alert-detail-card-heading-icon alert-detail-icon-green">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <h2>Resolución</h2>
                <p>Información de cierre</p>
              </div>
            </div>

            <p className="alert-detail-resolution-notes">
              {alert.resolution_notes ||
                "La alerta está marcada como resuelta, pero no tiene notas de resolución."}
            </p>
          </article>
        )}
      </div>

      {/* Acciones */}
      {!isResolved && (
        <section className="alert-detail-actions-card">
          <div className="alert-detail-actions-description">
            <h2>Gestión de la alerta</h2>
            <p>
              {isActive
                ? "Reconoce la alerta para indicar que ha sido revisada."
                : "Si el problema fue atendido, puedes marcar la alerta como resuelta."}
            </p>
          </div>

          <div className="alert-detail-actions">
            {isActive && (
              <button
                type="button"
                className="alert-detail-button alert-detail-button-secondary"
                onClick={() => void onAcknowledge?.(alert.id)}
                disabled={loading || !onAcknowledge}
              >
                <CheckCircle2 size={17} />
                Reconocer alerta
              </button>
            )}

            {(isActive || isAcknowledged) && (
              <button
                type="button"
                className="alert-detail-button alert-detail-button-primary"
                onClick={() => void onResolve?.(alert.id)}
                disabled={loading || !onResolve}
              >
                <CheckCircle2 size={17} />
                Resolver alerta
              </button>
            )}
          </div>
        </section>
      )}

      {isResolved && (
        <div className="alert-detail-resolved-banner">
          <CheckCircle2 size={20} />
          <div>
            <strong>Alerta resuelta</strong>
            <span>Esta alerta ya está marcada como resuelta.</span>
          </div>
        </div>
      )}
    </section>
  );
}