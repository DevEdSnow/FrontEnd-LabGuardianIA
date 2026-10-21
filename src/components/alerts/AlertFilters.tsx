import { useState } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export type AlertSeverityFilter =
  | "all"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AlertStatusFilter =
  | "all"
  | "active"
  | "acknowledged"
  | "resolved";

export interface AlertFilterValues {
  search: string;
  severity: AlertSeverityFilter;
  status: AlertStatusFilter;
}

interface AlertFiltersProps {
  filters: AlertFilterValues;
  onFiltersChange: (filters: AlertFilterValues) => void;
  totalAlerts?: number;
  loading?: boolean;
}

const severityOptions: {
  value: AlertSeverityFilter;
  label: string;
}[] = [
  { value: "all", label: "Todas las severidades" },
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

const statusOptions: {
  value: AlertStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activas" },
  { value: "acknowledged", label: "Reconocidas" },
  { value: "resolved", label: "Resueltas" },
];

export default function AlertFilters({
  filters,
  onFiltersChange,
  totalAlerts,
  loading = false,
}: AlertFiltersProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const activeFiltersCount = [
    filters.search.trim() !== "",
    filters.severity !== "all",
    filters.status !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const updateFilter = <K extends keyof AlertFilterValues>(
    key: K,
    value: AlertFilterValues[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      severity: "all",
      status: "all",
    });
  };

  return (
    <section
      className="alert-filters"
      aria-label="Filtros de alertas"
    >
      {/* Encabezado */}
      <div className="alert-filters-header">
        <div className="alert-filters-heading">
          <div className="alert-filters-heading-icon">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <h2 className="alert-filters-title">
              Filtros
            </h2>

            <p className="alert-filters-description">
              Encuentra rápidamente las alertas que necesitas.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="alert-filters-toggle"
          onClick={() => setFiltersExpanded((previous) => !previous)}
          aria-expanded={filtersExpanded}
        >
          {filtersExpanded ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {/* Controles */}
      {filtersExpanded && (
        <div className="alert-filters-controls">
          <div className="alert-filters-search">
            <Search
              size={18}
              className="alert-filters-search-icon"
              aria-hidden="true"
            />

            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                updateFilter("search", event.target.value)
              }
              placeholder="Buscar por título, mensaje o código..."
              aria-label="Buscar alertas"
              disabled={loading}
            />

            {filters.search && (
              <button
                type="button"
                className="alert-filters-clear-search"
                onClick={() => updateFilter("search", "")}
                aria-label="Limpiar búsqueda"
                disabled={loading}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="alert-filters-select-group">
            <label
              className="alert-filters-label"
              htmlFor="alert-severity-filter"
            >
              <AlertTriangle size={15} />
              Severidad
            </label>

            <select
              id="alert-severity-filter"
              value={filters.severity}
              onChange={(event) =>
                updateFilter(
                  "severity",
                  event.target.value as AlertSeverityFilter,
                )
              }
              disabled={loading}
            >
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="alert-filters-select-group">
            <label
              className="alert-filters-label"
              htmlFor="alert-status-filter"
            >
              <SlidersHorizontal size={15} />
              Estado
            </label>

            <select
              id="alert-status-filter"
              value={filters.status}
              onChange={(event) =>
                updateFilter(
                  "status",
                  event.target.value as AlertStatusFilter,
                )
              }
              disabled={loading}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="alert-filters-reset"
            onClick={resetFilters}
            disabled={!hasActiveFilters || loading}
          >
            <RotateCcw size={16} />
            Limpiar
          </button>
        </div>
      )}

      {/* Resumen */}
      <div className="alert-filters-footer">
        <div className="alert-filters-summary">
          <span className="alert-filters-summary-dot" />

          <span>
            {typeof totalAlerts === "number"
              ? `${totalAlerts} ${
                  totalAlerts === 1 ? "alerta" : "alertas"
                } encontradas`
              : "Filtra las alertas disponibles"}
          </span>
        </div>

        {hasActiveFilters && (
          <span className="alert-filters-active-count">
            {activeFiltersCount}{" "}
            {activeFiltersCount === 1
              ? "filtro aplicado"
              : "filtros aplicados"}
          </span>
        )}
      </div>
    </section>
  );
}