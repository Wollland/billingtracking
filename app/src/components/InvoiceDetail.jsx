import { useEffect, useState } from "react";
import { formatCurrency, formatDate, formatDateTime, statusLabel } from "../lib/format";

const statusOptions = ["pending", "reviewing", "booked", "paid", "duplicate_hold"];

export default function InvoiceDetail({
  invoice,
  duplicateGroup,
  savingStatusId,
  savingNoteId,
  mutationError,
  onStatusChange,
  onNoteSave,
}) {
  const [draftNote, setDraftNote] = useState("");

  useEffect(() => {
    setDraftNote(invoice?.localNote || "");
  }, [invoice?.id, invoice?.localNote]);

  if (!invoice) {
    return <div className="empty-card">Selecciona una factura para revisar el detalle.</div>;
  }

  return (
    <section className="panel detail-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Detalle</p>
          <h2>{invoice.invoiceNumber || invoice.supplier}</h2>
        </div>
        <a className="ghost-link" href={invoice.gmailUrl} target="_blank" rel="noreferrer">
          Abrir en Gmail
        </a>
      </div>

      <div className="hero-warning">
        <div className="chip-row">
          <span className={`chip status ${invoice.status}`}>{statusLabel(invoice.status)}</span>
          <span className={`chip due ${invoice.dueInfo.bucket}`}>{invoice.dueInfo.label}</span>
          {invoice.duplicate ? (
            <span className={`chip duplicate ${invoice.duplicate.role}`}>
              {invoice.duplicate.role === "canonical" ? "Factura canonica" : "Copia duplicada"}
            </span>
          ) : null}
          {invoice.duplicate ? (
            <span className={`chip source ${invoice.duplicate.source}`}>{invoice.duplicate.source}</span>
          ) : null}
        </div>
        <p>{invoice.summary}</p>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Datos clave</h3>
          <dl className="data-grid">
            <div>
              <dt>Proveedor</dt>
              <dd>{invoice.supplier}</dd>
            </div>
            <div>
              <dt>Cliente</dt>
              <dd>{invoice.customer}</dd>
            </div>
            <div>
              <dt>Fecha factura</dt>
              <dd>{formatDate(invoice.invoiceDate)}</dd>
            </div>
            <div>
              <dt>Vencimiento</dt>
              <dd>{formatDate(invoice.dueDate)}</dd>
            </div>
            <div>
              <dt>Base</dt>
              <dd>{formatCurrency(invoice.amountBase)}</dd>
            </div>
            <div>
              <dt>IVA</dt>
              <dd>{formatCurrency(invoice.amountTax)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatCurrency(invoice.amountTotal)}</dd>
            </div>
            <div>
              <dt>Recibida</dt>
              <dd>{formatDateTime(invoice.receivedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-card">
          <h3>Gestion</h3>
          <div className="actions-grid">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className={`status-button ${invoice.status === status ? "active" : ""}`}
                disabled={savingStatusId === invoice.id}
                onClick={() => onStatusChange(invoice.id, status)}
              >
                {statusLabel(status)}
              </button>
            ))}
          </div>
          <label className="field note-field">
            <span>Notas internas</span>
            <textarea
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              placeholder="Anota validaciones, pagos o incidencias..."
            />
          </label>
          <button
            type="button"
            className="secondary-button"
            disabled={savingNoteId === invoice.id || draftNote === (invoice.localNote || "")}
            onClick={() => onNoteSave(invoice.id, draftNote)}
          >
            {savingNoteId === invoice.id ? "Guardando..." : "Guardar nota"}
          </button>
          {mutationError ? <p className="notice notice-error">{mutationError}</p> : null}
        </div>

        <div className="detail-card detail-card-wide">
          <h3>Texto extraido</h3>
          <pre className="excerpt">{invoice.excerpt}</pre>
        </div>
      </div>

      {duplicateGroup ? (
        <div className="detail-card">
          <h3>Comprobacion de duplicado</h3>
          <p className="panel-note">
            {duplicateGroup.reason} Riesgo potencial: {formatCurrency(duplicateGroup.duplicateImpact)}.
          </p>
          <div className="duplicate-review">
            {duplicateGroup.items.map((item) => (
              <div key={item.id} className={`duplicate-line ${item.id === invoice.id ? "current" : ""}`}>
                <div>
                  <strong>{item.forwardedBy}</strong>
                  <p>
                    {item.subject}
                    <br />
                    <span>{formatDateTime(item.receivedAt)}</span>
                  </p>
                </div>
                <div className="chip-row">
                  <span className={`chip status ${item.status}`}>{statusLabel(item.status)}</span>
                  <span className={`chip duplicate ${item.id === duplicateGroup.canonical.id ? "canonical" : "duplicate"}`}>
                    {item.id === duplicateGroup.canonical.id ? "Canonica" : "Duplicada"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
