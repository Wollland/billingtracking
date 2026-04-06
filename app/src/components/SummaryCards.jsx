import { formatCurrency } from "../lib/format";

export default function SummaryCards({ summary }) {
  const cards = [
    {
      title: "Ocurrencias importadas",
      metric: summary.totalInvoices,
      note: "El recuento bruto incluye reenvios y varias apariciones de la misma factura.",
    },
    {
      title: "Total corregido",
      metric: formatCurrency(summary.correctedTotal),
      note: "Suma de la factura canonica por grupo, no de todos los correos.",
    },
    {
      title: "Riesgo de doble conteo",
      metric: formatCurrency(summary.duplicateImpact),
      note: "Importe que podria contarse dos veces si no se consolidan duplicados.",
    },
    {
      title: "Grupos duplicados",
      metric: summary.duplicateGroups,
      note: `${summary.unresolvedDuplicateGroups} grupo(s) siguen pendientes de revision.`,
    },
    {
      title: "Facturas urgentes",
      metric: summary.urgentCount,
      note: `${summary.overdueCount} vencidas y ${summary.todayCount} que vencen hoy.`,
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.title} className="summary-card">
          <p className="summary-label">{card.title}</p>
          <p className="summary-metric">{card.metric}</p>
          <p className="summary-note">{card.note}</p>
        </article>
      ))}
    </section>
  );
}
