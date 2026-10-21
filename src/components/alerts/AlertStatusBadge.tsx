import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export type AlertStatus =
  | "active"
  | "acknowledged"
  | "resolved"
  | "pending"
  | "investigating"
  | "dismissed";

interface AlertStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  AlertStatus,
  {
    label: string;
    className: string;
    Icon: typeof Activity;
  }
> = {
  active: {
    label: "Activa",
    className: "alert-status-active",
    Icon: CircleAlert,
  },
  acknowledged: {
    label: "Reconocida",
    className: "alert-status-acknowledged",
    Icon: ShieldCheck,
  },
  resolved: {
    label: "Resuelta",
    className: "alert-status-resolved",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pendiente",
    className: "alert-status-pending",
    Icon: Clock3,
  },
  investigating: {
    label: "En investigación",
    className: "alert-status-investigating",
    Icon: Activity,
  },
  dismissed: {
    label: "Descartada",
    className: "alert-status-dismissed",
    Icon: CheckCircle2,
  },
};

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function formatUnknownStatus(status: string): string {
  if (!status.trim()) {
    return "Sin estado";
  }

  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function AlertStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className = "",
}: AlertStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);

  const config = statusConfig[
    normalizedStatus as AlertStatus
  ];

  const label = config?.label ?? formatUnknownStatus(status);
  const statusClass = config?.className ?? "alert-status-unknown";
  const Icon = config?.Icon ?? Activity;

  const classes = [
    "alert-status-badge",
    statusClass,
    `alert-status-badge-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      title={`Estado de la alerta: ${label}`}
    >
      {showIcon && (
        <Icon
          className="alert-status-badge-icon"
          size={size === "sm" ? 12 : size === "lg" ? 17 : 14}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      )}

      <span>{label}</span>
    </span>
  );
}