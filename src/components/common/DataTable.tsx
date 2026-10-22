import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
} from "lucide-react";

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => unknown);
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

export interface DataTableAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "primary" | "danger" | "success";
  disabled?: (row: T) => boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string | number;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyDescription?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  rowActions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  title?: string;
  description?: string;
  toolbarActions?: ReactNode;
  className?: string;
}

function getCellValue<T>(
  row: T,
  column: DataTableColumn<T>,
): unknown {
  if (column.accessor === undefined) {
    return undefined;
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row);
  }

  return row[column.accessor];
}

function getSortableValue<T>(
  row: T,
  column: DataTableColumn<T>,
): string | number {
  const value = getCellValue(row, column);

  if (value == null) return "";

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return String(value).toLocaleLowerCase("es");
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return String(a).localeCompare(String(b), "es", {
    numeric: true,
    sensitivity: "base",
  });
}

export default function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  error = null,
  emptyMessage = "No hay registros disponibles",
  emptyDescription = "Prueba a cambiar los filtros o agrega un nuevo registro.",
  searchPlaceholder = "Buscar registros...",
  searchable = true,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  rowActions = [],
  onRowClick,
  title,
  description,
  toolbarActions,
  className = "",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] =
    useState<DataTableSortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);

  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns],
  );

  const filteredData = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");

    if (!query) return data;

    return data.filter((row) =>
      searchableColumns.some((column) => {
        const value = getCellValue(row, column);

        if (value == null) return false;

        return String(value)
          .toLocaleLowerCase("es")
          .includes(query);
      }),
    );
  }, [data, search, searchableColumns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    const column = columns.find((item) => item.key === sortKey);

    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const comparison = compareValues(
        getSortableValue(a, column),
        getSortableValue(b, column),
      );

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, columns, sortKey, sortDirection]);

  const totalPages = pagination
    ? Math.max(1, Math.ceil(sortedData.length / rowsPerPage))
    : 1;

  const safePage = Math.min(currentPage, totalPages);

  const visibleData = useMemo(() => {
    if (!pagination) return sortedData;

    const start = (safePage - 1) * rowsPerPage;

    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, pagination, safePage, rowsPerPage]);

  const startRecord =
    sortedData.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;

  const endRecord = pagination
    ? Math.min(safePage * rowsPerPage, sortedData.length)
    : sortedData.length;

  const handleSort = (column: DataTableColumn<T>) => {
    if (column.sortable === false) return;

    if (sortKey === column.key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );
    } else {
      setSortKey(column.key);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const renderSortIcon = (column: DataTableColumn<T>) => {
    if (sortKey !== column.key) {
      return (
        <ChevronsUpDown
          size={14}
          className="data-table-sort-icon"
          aria-hidden="true"
        />
      );
    }

    return sortDirection === "asc" ? (
      <ChevronUp
        size={14}
        className="data-table-sort-icon data-table-sort-icon-active"
        aria-hidden="true"
      />
    ) : (
      <ChevronDown
        size={14}
        className="data-table-sort-icon data-table-sort-icon-active"
        aria-hidden="true"
      />
    );
  };

  const renderPagination = () => {
    const pageNumbers: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pageNumbers.push(page);
      }
    } else if (safePage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else if (safePage >= totalPages - 2) {
      pageNumbers.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pageNumbers.push(
        1,
        "...",
        safePage - 1,
        safePage,
        safePage + 1,
        "...",
        totalPages,
      );
    }

    return (
      <div className="data-table-pagination-controls">
        <button
          type="button"
          className="data-table-page-arrow"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={safePage <= 1 || loading}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="data-table-page-ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`data-table-page-number ${
                safePage === page ? "data-table-page-number-active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
              disabled={loading}
              aria-label={`Página ${page}`}
              aria-current={safePage === page ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className="data-table-page-arrow"
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          disabled={safePage >= totalPages || loading}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <section
      className={["data-table-card", className].filter(Boolean).join(" ")}
    >
      {(title || description || toolbarActions) && (
        <div className="data-table-header">
          <div className="data-table-heading">
            {title && <h2 className="data-table-title">{title}</h2>}

            {description && (
              <p className="data-table-description">{description}</p>
            )}
          </div>

          {toolbarActions && (
            <div className="data-table-toolbar-actions">
              {toolbarActions}
            </div>
          )}
        </div>
      )}

      <div className="data-table-toolbar">
        {searchable ? (
          <label className="data-table-search">
            <Search
              size={17}
              className="data-table-search-icon"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Buscar en la tabla"
            />

            {search && (
              <button
                type="button"
                className="data-table-search-clear"
                onClick={() => handleSearch("")}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </label>
        ) : (
          <span />
        )}

        {pagination && (
          <label className="data-table-page-size">
            <span>Mostrar</span>
            <select
              value={rowsPerPage}
              onChange={(event) =>
                handlePageSizeChange(Number(event.target.value))
              }
              aria-label="Registros por página"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>por página</span>
          </label>
        )}
      </div>

      {error && (
        <div className="data-table-error" role="alert">
          <span>{error}</span>
        </div>
      )}

      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={column.className ?? ""}
                  style={{
                    width: column.width,
                    textAlign: column.align ?? "left",
                  }}
                >
                  {column.sortable === false ? (
                    <span>{column.header}</span>
                  ) : (
                    <button
                      type="button"
                      className="data-table-sort-button"
                      onClick={() => handleSort(column)}
                      aria-label={`Ordenar por ${column.header}`}
                    >
                      <span>{column.header}</span>
                      {renderSortIcon(column)}
                    </button>
                  )}
                </th>
              ))}

              {rowActions.length > 0 && (
                <th scope="col" className="data-table-actions-heading">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: Math.min(rowsPerPage, 5) }).map(
                (_, rowIndex) => (
                  <tr key={`skeleton-row-${rowIndex}`}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        <span className="data-table-skeleton" />
                      </td>
                    ))}

                    {rowActions.length > 0 && (
                      <td>
                        <span className="data-table-skeleton data-table-skeleton-actions" />
                      </td>
                    )}
                  </tr>
                ),
              )
            ) : visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                >
                  <div className="data-table-empty">
                    <div className="data-table-empty-icon">
                      <Search size={23} aria-hidden="true" />
                    </div>

                    <h3>{emptyMessage}</h3>
                    <p>
                      {search
                        ? "No hay coincidencias para tu búsqueda. Prueba con otro término."
                        : emptyDescription}
                    </p>

                    {search && (
                      <button
                        type="button"
                        className="data-table-clear-search"
                        onClick={() => handleSearch("")}
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              visibleData.map((row, rowIndex) => {
                const rowId = getRowId
                  ? getRowId(row, rowIndex)
                  : rowIndex;

                return (
                  <tr
                    key={rowId}
                    className={onRowClick ? "data-table-row-clickable" : ""}
                    onClick={() => onRowClick?.(row)}
                    onKeyDown={(event) => {
                      if (!onRowClick) return;

                      if (
                        event.target !== event.currentTarget ||
                        (event.key !== "Enter" && event.key !== " ")
                      ) {
                        return;
                      }

                      event.preventDefault();
                      onRowClick(row);
                    }}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-label={onRowClick ? "Abrir registro" : undefined}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={column.className ?? ""}
                        style={{ textAlign: column.align ?? "left" }}
                      >
                        {column.render
                          ? column.render(row)
                          : String(getCellValue(row, column) ?? "—")}
                      </td>
                    ))}

                    {rowActions.length > 0 && (
                      <td>
                        <div className="data-table-row-actions">
                          {rowActions.map((action, actionIndex) => {
                            const isDisabled =
                              action.disabled?.(row) ?? false;

                            return (
                              <button
                                key={`${action.label}-${actionIndex}`}
                                type="button"
                                className={[
                                  "data-table-row-action",
                                  `data-table-row-action--${
                                    action.variant ?? "default"
                                  }`,
                                ].join(" ")}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  action.onClick(row);
                                }}
                                disabled={isDisabled}
                                title={action.label}
                                aria-label={action.label}
                              >
                                {action.icon}
                                <span>{action.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="data-table-footer">
        <span className="data-table-record-count">
          {loading
            ? "Cargando registros..."
            : `Mostrando ${startRecord}–${endRecord} de ${sortedData.length} registros`}
        </span>

        {pagination && !loading && sortedData.length > 0 && renderPagination()}
      </div>
    </section>
  );
}