import { formatCurrency } from "../lib/format";

export default function DuplicateRadar({ groups, selectedId, onSelect }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Radar</p>
          <h2>Duplicados a vigilar</h2>
        </div>
        <p className="panel-note">La lista se ordena por impacto economico potencial.</p>
      </div>

      {groups.length ? (
        <div className="duplicate-list">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`duplicate-card ${selectedId === group.canonical.id ? "selected" : ""}`}
              onClick={() => onSelect(group.canonical.id)}
            >
              <div className="duplicate-topline">
                <span className={`chip source ${group.source}`}>{group.source}</span>
                <span className={`chip confidence ${group.confidence}`}>{group.confidence}</span>
                <span className="chip impact">{formatCurrency(group.duplicateImpact)} de riesgo</span>
              </div>
              <p className="duplicate-title">
                {group.canonical.supplier} · {group.canonical.invoiceNumber || "Sin numero"}
              </p>
              <p className="duplicate-copy">{group.reason}</p>
              <p className="duplicate-copy">
                {group.items.length} correos implicados. Canonica sugerida: {group.canonical.forwardedBy}.
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-card">No se han detectado grupos duplicados con las reglas actuales.</div>
      )}
    </section>
  );
}
