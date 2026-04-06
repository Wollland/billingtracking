export default function FiltersBar({
  filters,
  suppliers,
  onSearchChange,
  onFilterChange,
  onToggleCanonicalOnly,
}) {
  return (
    <section className="filters-panel">
      <label className="field field-search">
        <span>Buscar</span>
        <input
          type="search"
          value={filters.search}
          onChange={onSearchChange}
          placeholder="Proveedor, numero de factura, asunto, PDF..."
        />
      </label>

      <label className="field">
        <span>Proveedor</span>
        <select
          value={filters.supplier}
          onChange={(event) => onFilterChange("supplier", event.target.value)}
        >
          <option value="all">Todos</option>
          {suppliers.map((supplier) => (
            <option key={supplier} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Estado</span>
        <select value={filters.status} onChange={(event) => onFilterChange("status", event.target.value)}>
          <option value="all">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="reviewing">En revision</option>
          <option value="booked">Contabilizada</option>
          <option value="paid">Pagada</option>
          <option value="duplicate_hold">Duplicada retenida</option>
        </select>
      </label>

      <label className="field">
        <span>Vencimiento</span>
        <select value={filters.due} onChange={(event) => onFilterChange("due", event.target.value)}>
          <option value="all">Todos</option>
          <option value="overdue">Vencidas</option>
          <option value="today">Vence hoy</option>
          <option value="upcoming">Proximas</option>
          <option value="unknown">Sin fecha</option>
        </select>
      </label>

      <label className="field">
        <span>Duplicados</span>
        <select
          value={filters.duplicates}
          onChange={(event) => onFilterChange("duplicates", event.target.value)}
        >
          <option value="all">Todo</option>
          <option value="only">Solo duplicados</option>
          <option value="hide">Ocultar duplicados</option>
        </select>
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          checked={filters.canonicalOnly}
          onChange={(event) => onToggleCanonicalOnly(event.target.checked)}
        />
        <span>Mostrar solo la factura canonica por grupo</span>
      </label>
    </section>
  );
}
