import { formatCurrency, formatDate, formatDateTime, statusLabel } from "../lib/format";

export default function InvoiceList({ invoices, selectedId, onSelect }) {
  if (!invoices.length) {
    return <div className="empty-card">No hay facturas que cumplan los filtros actuales.</div>;
  }

  return (
    <div className="invoice-list">
      {invoices.map((invoice) => {
        const isSelected = invoice.id === selectedId;
        return (
          <button
            key={invoice.id}
            type="button"
            className={`invoice-row ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(invoice.id)}
          >
            <div className="invoice-main">
              <div className="invoice-heading">
                <p className="invoice-supplier">{invoice.supplier}</p>
                <div className="chip-row">
                  <span className={`chip status ${invoice.status}`}>{statusLabel(invoice.status)}</span>
                  {invoice.duplicate ? (
                    <span className={`chip duplicate ${invoice.duplicate.role}`}>
                      {invoice.duplicate.role === "canonical"
                        ? `Canonica x${invoice.duplicate.count}`
                        : `Duplicada x${invoice.duplicate.count}`}
                    </span>
                  ) : null}
                  {invoice.duplicate ? (
                    <span className={`chip source ${invoice.duplicate.source}`}>
                      {invoice.duplicate.source}
                    </span>
                  ) : null}
                  <span className={`chip due ${invoice.dueInfo.bucket}`}>{invoice.dueInfo.label}</span>
                </div>
              </div>
              <p className="invoice-subject">{invoice.subject}</p>
              <p className="invoice-meta">
                <span>{invoice.invoiceNumber || "Sin numero"}</span>
                <span>{invoice.customer}</span>
                <span>{formatDateTime(invoice.receivedAt)}</span>
              </p>
            </div>

            <div className="invoice-stats">
              <div>
                <span className="label">Factura</span>
                <strong>{invoice.invoiceDate ? formatDate(invoice.invoiceDate) : "Sin fecha"}</strong>
              </div>
              <div>
                <span className="label">Vence</span>
                <strong>{formatDate(invoice.dueDate)}</strong>
              </div>
              <div>
                <span className="label">Total</span>
                <strong className="amount">{formatCurrency(invoice.amountTotal)}</strong>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
