import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "billingtracking-state-v1";

const DATA = {
  labelName: "@CONTROL FACTURACION",
  syncedAt: "2026-04-07T00:15:00+02:00",
  currentDate: "2026-04-07",
  invoices: [
    {
      id: "19d4956a2592b358",
      supplier: "Iberdrola Clientes, S.A.U.",
      customer: "Operadora de Telecomunicaciones Opera S.L.",
      forwardedBy: "Ziortza Garcia",
      sourceSender: "Iberdrola via Facturacion",
      subject: "Fwd: Ya tienes disponible tu factura de electricidad de Iberdrola",
      receivedAt: "2026-04-01T13:58:12+02:00",
      invoiceNumber: "21260330010201602",
      invoiceDate: "2026-03-30",
      dueDate: "2026-04-07",
      amountBase: 32.4,
      amountTax: 3.46,
      amountTotal: 35.86,
      category: "suministro",
      status: "pending",
      attachmentFilename: "868296156_2026-03-30-16.42.29.001881.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d4956a2592b358",
      duplicateKey: null,
      extractionConfidence: "high",
      summary:
        "Factura de electricidad del suministro de Logrono. El PDF trae numero de contrato, periodo y fecha prevista de cobro.",
      excerpt:
        "N FACTURA: 21260330010201602 | Periodo 23/02/2026 - 25/03/2026 | TOTAL 35,86 EUR | FECHA PREVISTA DE COBRO 07/04/2026.",
    },
    {
      id: "19d4954f42662cb8",
      supplier: "TTM Telekom FZE",
      customer: "Dialoga Interactive Services SA",
      forwardedBy: "Ziortza Garcia",
      sourceSender: "TTM Telekom FZE Finance Team",
      subject: "Fwd: TTM Telekom FZE 2026-03-01 - 2026-03-31 period invoice notification",
      receivedAt: "2026-04-01T13:56:23+02:00",
      invoiceNumber: "199258",
      invoiceDate: "2026-03-31",
      dueDate: "2026-04-01",
      amountBase: 515.9,
      amountTax: 0,
      amountTotal: 515.9,
      category: "telecom",
      status: "pending",
      attachmentFilename: "20260331FZE19925890191.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d4954f42662cb8",
      duplicateKey: null,
      extractionConfidence: "high",
      summary:
        "Factura de trafico y servicios de TTM. Vencimiento inmediato, un dia despues de la emision.",
      excerpt:
        "INVOICE # 199258 | Invoice Date 31/03/2026 | Due Date 01/04/2026 | Total 515,90 EUR.",
    },
    {
      id: "19d48f9af2485555",
      supplier: "Portabil - Portabilidade em Telecomunicacoes, S.A.",
      customer: "Dialoga Servicios Interactivos, S.A.",
      forwardedBy: "Ziortza Garcia",
      sourceSender: "Contabilidade",
      subject: "Fwd: PORTABIL - invoice Dialoga 2026.66",
      receivedAt: "2026-04-01T12:16:41+02:00",
      invoiceNumber: "FT FA.2026/66",
      invoiceDate: "2026-04-01",
      dueDate: "2026-05-31",
      amountBase: 373.96,
      amountTax: 0,
      amountTotal: 373.96,
      category: "telecom",
      status: "pending",
      attachmentFilename: "Fatura FT FA.2026.66 Dialoga.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48f9af2485555",
      duplicateKey: "portabil-ft-fa-2026-66",
      extractionConfidence: "high",
      summary:
        "Factura mensual de Portabil a 60 dias. Detectada duplicada porque aparece reenviada por dos personas distintas.",
      excerpt:
        "Fatura FT FA.2026/66 | Data 2026-04-01 | Vencimento 2026-05-31 | Total 373,96 EUR.",
    },
    {
      id: "19d48f7b9c0a9bac",
      supplier: "APNF",
      customer: "ALNILAM / Billing FR",
      forwardedBy: "Jaione Benito",
      sourceSender: "Danielle Roussel",
      subject: "Fwd: APNF - Portabilite Mars FA154418",
      receivedAt: "2026-04-01T12:14:31+02:00",
      invoiceNumber: "FA154418",
      invoiceDate: "2026-03-31",
      dueDate: "2026-05-15",
      amountBase: 375.4,
      amountTax: 75.08,
      amountTotal: 450.48,
      category: "portabilidad",
      status: "pending",
      attachmentFilename: "ALNI00_-_Facture_APNF_-FA154418_ - _ALNILAM.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48f7b9c0a9bac",
      duplicateKey: null,
      extractionConfidence: "high",
      summary:
        "Factura francesa de APNF con servicio de alimentacion, VPN y numeros portados.",
      excerpt:
        "Facture N FA154418 | Du 31/03/2026 | Net a payer 450,48 EUR | Payable le 15/05/2026.",
    },
    {
      id: "19d48f73f487addd",
      supplier: "Portabil - Portabilidade em Telecomunicacoes, S.A.",
      customer: "Dialoga Servicios Interactivos, S.A.",
      forwardedBy: "Jaione Benito",
      sourceSender: "Contabilidade",
      subject: "Fwd: PORTABIL - invoice Dialoga 2026.66",
      receivedAt: "2026-04-01T12:14:01+02:00",
      invoiceNumber: "FT FA.2026/66",
      invoiceDate: "2026-04-01",
      dueDate: "2026-05-31",
      amountBase: 373.96,
      amountTax: 0,
      amountTotal: 373.96,
      category: "telecom",
      status: "pending",
      attachmentFilename: "Fatura FT FA.2026.66 Dialoga.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48f73f487addd",
      duplicateKey: "portabil-ft-fa-2026-66",
      extractionConfidence: "high",
      summary:
        "Misma factura de Portabil reenviada por otro remitente interno. Conviene decidir cual es el correo canonico.",
      excerpt:
        "Fatura FT FA.2026/66 | Data 2026-04-01 | Vencimento 2026-05-31 | Total 373,96 EUR.",
    },
    {
      id: "19d48e91761f0981",
      supplier: "Partenon Consulting Inmobiliario S.L.",
      customer: "Operadora de Telecomunicaciones Opera S.L.",
      forwardedBy: "Jaione Benito",
      sourceSender: "Isabel Herreros",
      subject: "Fwd: FACTURA PARTENON",
      receivedAt: "2026-04-01T11:58:33+02:00",
      invoiceNumber: "P2600002",
      invoiceDate: "2026-04-01",
      dueDate: "2026-04-20",
      amountBase: 6000,
      amountTax: 1260,
      amountTotal: 7260,
      category: "alquiler",
      status: "pending",
      attachmentFilename: "P2600002_OPERADORA_DE_TELECOMUNICACIONES_OPERA_S_L_.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48e91761f0981",
      duplicateKey: null,
      extractionConfidence: "high",
      summary:
        "Factura de alquiler de oficina y garaje con tres mensualidades en un solo documento.",
      excerpt:
        "FACTURA n: P2600002 | SUBTOTAL 6.000,00 EUR | IVA 1.260,00 EUR | TOTAL 7.260,00 EUR | Vencimiento 20/04/2026.",
    },
    {
      id: "19d48ddcf917afeb",
      supplier: "Amilibia y Lavandero Abogados, S.L.P.",
      customer: "Dialoga Servicios Interactivos, S.A.",
      forwardedBy: "Ziortza Garcia",
      sourceSender: "Patricia Hernando",
      subject: "Fwd: MINUTA MES MARZO 2026",
      receivedAt: "2026-04-01T11:46:13+02:00",
      invoiceNumber: "2026/68",
      invoiceDate: "2026-03-31",
      dueDate: "2026-03-31",
      amountBase: 10500,
      amountTax: 2205,
      amountTotal: 12705,
      category: "servicios juridicos",
      status: "pending",
      attachmentFilename: "068.26.4 Dialoga.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48ddcf917afeb",
      duplicateKey: null,
      extractionConfidence: "high",
      summary:
        "Minuta juridica de marzo con vencimiento en la misma fecha de expedicion. Punto de atencion prioritaria.",
      excerpt:
        "Factura 2026 / 68 | Fecha 31-03-2026 | Vencimiento 31-03-2026 | Total 12.705,00 EUR.",
    },
    {
      id: "19d48d8f28af9646",
      supplier: "Torre Iberdrola, A.I.E.",
      customer: "Aeternal Mentis, S.A.",
      forwardedBy: "Jaione Benito",
      sourceSender: "Carlos Valverde Rodriguez via Admin",
      subject: "Fwd: Factura Aeternal Mentis abril 2026 Torre Iberdrola",
      receivedAt: "2026-04-01T11:40:54+02:00",
      invoiceNumber: "26/0099/000308",
      invoiceDate: "2026-04-01",
      dueDate: null,
      amountBase: 2797.04,
      amountTax: 587.38,
      amountTotal: 3384.42,
      category: "alquiler",
      status: "pending",
      attachmentFilename: "FA-TI-260099000308 AETERNAL MENTIS abril 2026.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48d8f28af9646",
      duplicateKey: null,
      extractionConfidence: "medium",
      summary:
        "Factura de Torre Iberdrola para Aeternal Mentis. El PDF trae importes pero no deja una fecha de vencimiento clara.",
      excerpt:
        "FACTURA N 26/0099/000308 | Base 2.797,04 EUR | IVA 587,38 EUR | TOTAL 3.384,42 EUR.",
    },
    {
      id: "19d48d8768164cb3",
      supplier: "Torre Iberdrola, A.I.E.",
      customer: "Dialoga Servicios Interactivos, S.A.",
      forwardedBy: "Jaione Benito",
      sourceSender: "Carlos Valverde Rodriguez via Admin",
      subject: "Fwd: Factura Dialoga abril 2026 Torre Iberdrola",
      receivedAt: "2026-04-01T11:40:23+02:00",
      invoiceNumber: "26/0099/000290",
      invoiceDate: "2026-04-01",
      dueDate: null,
      amountBase: 51913.28,
      amountTax: 10901.79,
      amountTotal: 62815.07,
      category: "alquiler",
      status: "pending",
      attachmentFilename: "FA-TI-260099000290 DIALOGA abril 2026.pdf",
      gmailUrl: "https://mail.google.com/mail/#all/19d48d8768164cb3",
      duplicateKey: null,
      extractionConfidence: "medium",
      summary:
        "Factura principal de Torre Iberdrola para Dialoga con renta, gastos comunes y parking.",
      excerpt:
        "FACTURA N 26/0099/000290 | Base 51.913,28 EUR | IVA 10.901,79 EUR | TOTAL 62.815,07 EUR.",
    },
  ],
};

function normalizeText(value = "") {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function collapseTokens(value = "") {
  return normalizeText(value)
    .replace(/\b(sa|sau|sl|slu|slp|aie|ltd|llc|inc|corp|company|sociedad|consulting)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeInvoiceNumber(value = "") {
  return normalizeText(value)
    .replace(/\b(factura|invoice|facture|fatura|no|nr|num|numero|n)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function normalizeFilename(value = "") {
  return normalizeText(value)
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function amountKey(value) {
  return Number(value || 0).toFixed(2);
}

function scoreCanonical(invoice) {
  let score = 0;
  if (invoice.extractionConfidence === "high") score += 4;
  if (invoice.extractionConfidence === "medium") score += 2;
  if (invoice.invoiceNumber) score += 2;
  if (invoice.dueDate) score += 1;
  if (invoice.excerpt) score += 1;
  return score;
}

function chooseCanonical(items) {
  return [...items].sort((left, right) => {
    const scoreDelta = scoreCanonical(right) - scoreCanonical(left);
    if (scoreDelta !== 0) return scoreDelta;
    return new Date(left.receivedAt) - new Date(right.receivedAt);
  })[0];
}

function detectDuplicateGroups(invoices) {
  const assigned = new Set();
  const groups = [];

  const rules = [
    {
      kind: "manual",
      confidence: "high",
      reason: "Clave de duplicado heredada del parser.",
      fingerprint: (invoice) =>
        invoice.duplicateKey ? `manual:${normalizeText(invoice.duplicateKey)}` : null,
    },
    {
      kind: "invoice_number",
      confidence: "high",
      reason: "Proveedor + numero de factura + importe total coinciden.",
      fingerprint: (invoice) => {
        const supplier = collapseTokens(invoice.supplier);
        const number = normalizeInvoiceNumber(invoice.invoiceNumber);
        if (!supplier || !number) return null;
        return `invoice:${supplier}|${number}|${amountKey(invoice.amountTotal)}`;
      },
    },
    {
      kind: "attachment",
      confidence: "medium",
      reason: "Nombre de PDF + importe total coinciden.",
      fingerprint: (invoice) => {
        const filename = normalizeFilename(invoice.attachmentFilename);
        if (!filename) return null;
        return `file:${filename}|${amountKey(invoice.amountTotal)}`;
      },
    },
    {
      kind: "fallback",
      confidence: "medium",
      reason: "Proveedor + fecha factura + importe total coinciden.",
      fingerprint: (invoice) => {
        const supplier = collapseTokens(invoice.supplier);
        if (!supplier || !invoice.invoiceDate) return null;
        return `fallback:${supplier}|${invoice.invoiceDate}|${amountKey(invoice.amountTotal)}`;
      },
    },
  ];

  rules.forEach((rule) => {
    const buckets = new Map();
    invoices.forEach((invoice) => {
      const key = rule.fingerprint(invoice);
      if (!key) return;
      const items = buckets.get(key) || [];
      items.push(invoice);
      buckets.set(key, items);
    });

    buckets.forEach((items, key) => {
      const available = items.filter((invoice) => !assigned.has(invoice.id));
      if (available.length < 2) return;

      const canonical = chooseCanonical(available);
      const rawTotal = available.reduce((sum, invoice) => sum + invoice.amountTotal, 0);
      const duplicateImpact = rawTotal - canonical.amountTotal;

      groups.push({
        id: `${rule.kind}:${key}`,
        kind: rule.kind,
        confidence: rule.confidence,
        reason: rule.reason,
        canonicalId: canonical.id,
        items: available,
        duplicateImpact,
      });

      available.forEach((invoice) => assigned.add(invoice.id));
    });
  });

  const duplicateMeta = {};

  groups
    .sort((left, right) => right.duplicateImpact - left.duplicateImpact)
    .forEach((group) => {
      group.items.forEach((invoice) => {
        duplicateMeta[invoice.id] = {
          groupId: group.id,
          role: invoice.id === group.canonicalId ? "canonical" : "duplicate",
          count: group.items.length,
          confidence: group.confidence,
          reason: group.reason,
          duplicateImpact: group.duplicateImpact,
        };
      });
    });

  return { groups, duplicateMeta };
}

function loadState() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDueInfo(dueDate, currentDate) {
  if (!dueDate) return { bucket: "unknown", label: "Sin fecha" };
  const delta = Math.floor((new Date(`${dueDate}T00:00:00`) - new Date(`${currentDate}T00:00:00`)) / 86400000);
  if (delta < 0) return { bucket: "overdue", label: "Vencida" };
  if (delta === 0) return { bucket: "today", label: "Vence hoy" };
  return { bucket: "upcoming", label: "Proxima" };
}

function statusLabel(status) {
  return {
    pending: "Pendiente",
    reviewing: "En revision",
    booked: "Contabilizada",
    paid: "Pagada",
    duplicate_hold: "Duplicada retenida",
  }[status] || "Pendiente";
}

const styles = `
:root {
  --ink: #18211f;
  --muted: #5f6f6a;
  --paper: #f7f1e4;
  --panel: rgba(255, 251, 245, 0.86);
  --line: rgba(24, 33, 31, 0.12);
  --accent: #bf5d26;
  --success: #2f7a56;
  --danger: #ae4444;
  --warning: #b98617;
  --shadow: 0 24px 64px rgba(24, 33, 31, 0.14);
}
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; margin: 0; }
body {
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(240, 192, 124, 0.86), transparent 28%),
    radial-gradient(circle at top right, rgba(191, 93, 38, 0.18), transparent 18%),
    linear-gradient(180deg, #efe3ca 0%, #f7f2e6 34%, #ece2d2 100%);
  font-family: "Avenir Next", "Segoe UI", sans-serif;
}
.app {
  width: min(1440px, calc(100vw - 32px));
  margin: 24px auto 48px;
}
.hero, .panel, .summary-card, .invoice-row, .duplicate-card, .detail-card {
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
}
.hero {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 20px;
  padding: 30px;
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(255, 249, 241, 0.92), rgba(245, 233, 214, 0.82));
}
.eyebrow {
  margin: 0 0 10px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
h1, h2 {
  margin: 0;
  font-family: Georgia, serif;
  line-height: 0.96;
  letter-spacing: -0.03em;
}
h1 { font-size: clamp(2.6rem, 4vw, 4.6rem); max-width: 11ch; }
h2 { font-size: clamp(1.45rem, 2vw, 2.2rem); }
.hero-copy p, .hero-side p, .panel-note, .invoice-subject, .invoice-meta, .summary-card p, .duplicate-card p {
  color: var(--muted);
  line-height: 1.6;
}
.hero-side {
  padding: 22px;
  border-radius: 22px;
  background: rgba(24, 33, 31, 0.94);
  color: #f6efe2;
}
.hero-side p, .hero-side h2 { color: inherit; }
.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}
.summary-card {
  padding: 18px;
  border-radius: 18px;
  background: var(--panel);
}
.summary-card .metric {
  margin: 10px 0 6px;
  font-size: clamp(1.7rem, 2vw, 2.4rem);
  font-weight: 800;
}
.filters {
  display: grid;
  grid-template-columns: 2fr repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255,255,255,0.72);
  box-shadow: var(--shadow);
}
.field, .toggle {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 800;
}
.field input, .field select, textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(24, 33, 31, 0.14);
  border-radius: 12px;
  background: rgba(255,255,255,0.96);
  color: var(--ink);
  font: inherit;
}
.toggle {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.workspace {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 18px;
  margin-top: 18px;
}
.side-column {
  display: grid;
  gap: 18px;
  align-content: start;
}
.panel {
  padding: 20px;
  border-radius: 28px;
  background: var(--panel);
}
.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  align-items: end;
}
.invoice-list, .duplicate-list, .detail-stack { display: grid; gap: 12px; }
.invoice-row, .duplicate-card {
  width: 100%;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.84);
  text-align: left;
  cursor: pointer;
}
.invoice-row.selected, .duplicate-card.selected { border-color: rgba(191,93,38,0.28); }
.invoice-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;
}
.invoice-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.invoice-supplier, .duplicate-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}
.invoice-subject { margin: 8px 0 10px; }
.invoice-meta {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.9rem;
}
.invoice-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  background: rgba(24, 33, 31, 0.08);
}
.pending, .today, .medium { color: var(--warning); background: rgba(185,134,23,0.12); }
.reviewing { color: var(--accent); background: rgba(191,93,38,0.12); }
.booked, .paid, .upcoming, .high, .canonical { color: var(--success); background: rgba(47,122,86,0.13); }
.duplicate_hold, .overdue, .duplicate, .impact { color: var(--danger); background: rgba(174,68,68,0.12); }
.detail-card {
  padding: 18px;
  border-radius: 22px;
  background: rgba(255,255,255,0.78);
}
.detail-card h3 {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 0.92rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.detail-wide { grid-column: 1 / -1; }
.data-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.data-grid dt {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.data-grid dd { margin: 0; font-weight: 700; }
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.status-button {
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: rgba(24,33,31,0.08);
  color: var(--ink);
  cursor: pointer;
  font-weight: 800;
}
.status-button.active { background: var(--ink); color: white; }
.excerpt {
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background: #1b2220;
  color: #f7f0e4;
  white-space: pre-wrap;
  line-height: 1.6;
}
.duplicate-review {
  display: grid;
  gap: 10px;
}
.duplicate-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(247,241,228,0.76);
}
.duplicate-line.current { outline: 2px solid rgba(191,93,38,0.22); }
.ghost-link {
  color: var(--accent);
  font-weight: 800;
  text-decoration: none;
}
.empty {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.76);
  color: var(--muted);
}
@media (max-width: 1180px) {
  .hero, .filters, .workspace, .invoice-row, .detail-grid, .summary-grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .app { width: min(100vw - 20px, 100%); margin: 10px auto 28px; }
  .panel, .hero, .filters { padding: 18px; }
  .panel-head, .invoice-heading, .duplicate-line { flex-direction: column; align-items: start; }
  .invoice-stats, .data-grid { grid-template-columns: 1fr; }
}
`;

function buildSummary(invoices, groups) {
  const duplicateIds = new Set(groups.flatMap((group) => group.items.map((item) => item.id)));
  const canonicalIds = new Set(groups.map((group) => group.canonicalId));
  const correctedTotal = invoices.reduce((sum, invoice) => {
    if (!duplicateIds.has(invoice.id)) return sum + invoice.amountTotal;
    if (canonicalIds.has(invoice.id)) return sum + invoice.amountTotal;
    return sum;
  }, 0);

  const unresolved = groups.filter((group) =>
    group.items.some((invoice) => invoice.id !== group.canonicalId && invoice.status !== "duplicate_hold")
  ).length;

  return {
    totalInvoices: invoices.length,
    correctedTotal,
    duplicateImpact: groups.reduce((sum, group) => sum + group.duplicateImpact, 0),
    duplicateGroups: groups.length,
    unresolved,
    urgentCount: invoices.filter((invoice) => ["overdue", "today"].includes(invoice.dueInfo.bucket)).length,
  };
}

export default function App() {
  const [runtimeState, setRuntimeState] = useState(loadState);
  const [selectedId, setSelectedId] = useState(DATA.invoices[0]?.id || null);
  const [filters, setFilters] = useState({
    search: "",
    supplier: "all",
    status: "all",
    due: "all",
    duplicates: "all",
    canonicalOnly: false,
  });

  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());

  const prepared = useMemo(() => {
    const base = DATA.invoices.map((invoice) => {
      const state = runtimeState[invoice.id] || {};
      return {
        ...invoice,
        status: state.status || invoice.status,
        localNote: state.note || "",
        dueInfo: getDueInfo(invoice.dueDate, DATA.currentDate),
      };
    });
    const { groups, duplicateMeta } = detectDuplicateGroups(base);
    return {
      invoices: base
        .map((invoice) => ({
          ...invoice,
          duplicate: duplicateMeta[invoice.id] || null,
        }))
        .sort((left, right) => new Date(right.receivedAt) - new Date(left.receivedAt)),
      groups: groups.sort((left, right) => right.duplicateImpact - left.duplicateImpact),
    };
  }, [runtimeState]);

  const suppliers = useMemo(
    () => [...new Set(prepared.invoices.map((invoice) => invoice.supplier))].sort(),
    [prepared.invoices]
  );

  const visibleInvoices = useMemo(() => {
    return prepared.invoices.filter((invoice) => {
      const haystack = [
        invoice.supplier,
        invoice.customer,
        invoice.subject,
        invoice.invoiceNumber,
        invoice.attachmentFilename,
        invoice.localNote,
      ]
        .join(" ")
        .toLowerCase();

      if (deferredSearch && !haystack.includes(deferredSearch)) return false;
      if (filters.supplier !== "all" && invoice.supplier !== filters.supplier) return false;
      if (filters.status !== "all" && invoice.status !== filters.status) return false;
      if (filters.due !== "all" && invoice.dueInfo.bucket !== filters.due) return false;
      if (filters.duplicates === "only" && !invoice.duplicate) return false;
      if (filters.duplicates === "hide" && invoice.duplicate?.role === "duplicate") return false;
      if (filters.canonicalOnly && invoice.duplicate?.role === "duplicate") return false;
      return true;
    });
  }, [prepared.invoices, filters, deferredSearch]);

  const selectedInvoice =
    visibleInvoices.find((invoice) => invoice.id === selectedId) ||
    prepared.invoices.find((invoice) => invoice.id === selectedId) ||
    visibleInvoices[0] ||
    prepared.invoices[0] ||
    null;

  const selectedGroup = selectedInvoice?.duplicate
    ? prepared.groups.find((group) => group.id === selectedInvoice.duplicate.groupId)
    : null;

  const summary = buildSummary(prepared.invoices, prepared.groups);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runtimeState));
  }, [runtimeState]);

  function updateInvoice(invoiceId, patch) {
    setRuntimeState((current) => ({
      ...current,
      [invoiceId]: {
        ...(current[invoiceId] || {}),
        ...patch,
      },
    }));
  }

  function changeFilter(key, value) {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    });
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{DATA.labelName}</p>
            <h1>Billing tracking en React con control serio de duplicados</h1>
            <p>
              No suma correos. Suma facturas canonicas. Cuando la misma factura llega reenviada
              varias veces, la app detecta el grupo, estima el riesgo economico y permite retener
              las copias.
            </p>
            <p>
              Ultima captura: {formatDateTime(DATA.syncedAt)} · Dataset actual: {prepared.invoices.length} correos
            </p>
          </div>
          <div className="hero-side">
            <p className="eyebrow">Regla operativa</p>
            <h2>Lo importante es no pagar dos veces.</h2>
            <p>
              Reglas activas: clave manual del parser, proveedor + numero + importe, nombre de PDF
              + importe y proveedor + fecha + importe.
            </p>
          </div>
        </header>

        <section className="summary-grid">
          <article className="summary-card">
            <p>Correos con adjunto</p>
            <p className="metric">{summary.totalInvoices}</p>
            <p>Cuenta todos los correos, incluidos reenvios.</p>
          </article>
          <article className="summary-card">
            <p>Total corregido</p>
            <p className="metric">{formatCurrency(summary.correctedTotal)}</p>
            <p>Solo suma una factura canonica por grupo.</p>
          </article>
          <article className="summary-card">
            <p>Riesgo de doble conteo</p>
            <p className="metric">{formatCurrency(summary.duplicateImpact)}</p>
            <p>Importe potencialmente repetido si no se consolida.</p>
          </article>
          <article className="summary-card">
            <p>Grupos duplicados</p>
            <p className="metric">{summary.duplicateGroups}</p>
            <p>{summary.unresolved} grupo(s) siguen sin retener todas las copias.</p>
          </article>
          <article className="summary-card">
            <p>Facturas urgentes</p>
            <p className="metric">{summary.urgentCount}</p>
            <p>Vencidas o con vencimiento hoy.</p>
          </article>
        </section>

        <section className="filters">
          <label className="field">
            <span>Buscar</span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => changeFilter("search", event.target.value)}
              placeholder="Proveedor, numero, asunto, PDF..."
            />
          </label>
          <label className="field">
            <span>Proveedor</span>
            <select value={filters.supplier} onChange={(event) => changeFilter("supplier", event.target.value)}>
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
            <select value={filters.status} onChange={(event) => changeFilter("status", event.target.value)}>
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
            <select value={filters.due} onChange={(event) => changeFilter("due", event.target.value)}>
              <option value="all">Todos</option>
              <option value="overdue">Vencidas</option>
              <option value="today">Vence hoy</option>
              <option value="upcoming">Proximas</option>
              <option value="unknown">Sin fecha</option>
            </select>
          </label>
          <label className="field">
            <span>Duplicados</span>
            <select value={filters.duplicates} onChange={(event) => changeFilter("duplicates", event.target.value)}>
              <option value="all">Todo</option>
              <option value="only">Solo duplicados</option>
              <option value="hide">Ocultar copias duplicadas</option>
            </select>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={filters.canonicalOnly}
              onChange={(event) => changeFilter("canonicalOnly", event.target.checked)}
            />
            <span>Mostrar solo la factura canonica por grupo</span>
          </label>
        </section>

        <main className="workspace">
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Bandeja</p>
                <h2>Facturas recibidas</h2>
              </div>
              <p className="panel-note">{visibleInvoices.length} resultado(s)</p>
            </div>

            {visibleInvoices.length ? (
              <div className="invoice-list">
                {visibleInvoices.map((invoice) => (
                  <button
                    key={invoice.id}
                    type="button"
                    className={`invoice-row ${invoice.id === selectedInvoice?.id ? "selected" : ""}`}
                    onClick={() => setSelectedId(invoice.id)}
                  >
                    <div>
                      <div className="invoice-heading">
                        <p className="invoice-supplier">{invoice.supplier}</p>
                        <div className="chip-row">
                          <span className={`chip ${invoice.status}`}>{statusLabel(invoice.status)}</span>
                          {invoice.duplicate ? (
                            <span className={`chip ${invoice.duplicate.role}`}>
                              {invoice.duplicate.role === "canonical"
                                ? `Canonica x${invoice.duplicate.count}`
                                : `Duplicada x${invoice.duplicate.count}`}
                            </span>
                          ) : null}
                          <span className={`chip ${invoice.dueInfo.bucket}`}>{invoice.dueInfo.label}</span>
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
                        <strong>{formatDate(invoice.invoiceDate)}</strong>
                      </div>
                      <div>
                        <span className="label">Vence</span>
                        <strong>{formatDate(invoice.dueDate)}</strong>
                      </div>
                      <div>
                        <span className="label">Total</span>
                        <strong>{formatCurrency(invoice.amountTotal)}</strong>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty">No hay facturas que cumplan los filtros actuales.</div>
            )}
          </section>

          <div className="side-column">
            <section className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Radar</p>
                  <h2>Duplicados</h2>
                </div>
                <p className="panel-note">Ordenados por impacto economico.</p>
              </div>

              {prepared.groups.length ? (
                <div className="duplicate-list">
                  {prepared.groups.map((group) => {
                    const canonical = group.items.find((item) => item.id === group.canonicalId);
                    return (
                      <button
                        key={group.id}
                        type="button"
                        className={`duplicate-card ${selectedGroup?.id === group.id ? "selected" : ""}`}
                        onClick={() => setSelectedId(group.canonicalId)}
                      >
                        <div className="chip-row">
                          <span className={`chip ${group.confidence}`}>{group.confidence}</span>
                          <span className="chip impact">{formatCurrency(group.duplicateImpact)} de riesgo</span>
                        </div>
                        <p className="duplicate-title">
                          {canonical?.supplier} · {canonical?.invoiceNumber || "Sin numero"}
                        </p>
                        <p>{group.reason}</p>
                        <p>{group.items.length} correos implicados. Canonica sugerida: {canonical?.forwardedBy}.</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="empty">No se han detectado grupos duplicados.</div>
              )}
            </section>

            <section className="panel">
              {selectedInvoice ? (
                <div className="detail-stack">
                  <div className="panel-head">
                    <div>
                      <p className="eyebrow">Detalle</p>
                      <h2>{selectedInvoice.invoiceNumber || selectedInvoice.supplier}</h2>
                    </div>
                    <a className="ghost-link" href={selectedInvoice.gmailUrl} target="_blank" rel="noreferrer">
                      Abrir en Gmail
                    </a>
                  </div>

                  <div className="detail-card">
                    <div className="chip-row">
                      <span className={`chip ${selectedInvoice.status}`}>{statusLabel(selectedInvoice.status)}</span>
                      <span className={`chip ${selectedInvoice.dueInfo.bucket}`}>{selectedInvoice.dueInfo.label}</span>
                      {selectedInvoice.duplicate ? (
                        <span className={`chip ${selectedInvoice.duplicate.role}`}>
                          {selectedInvoice.duplicate.role === "canonical" ? "Factura canonica" : "Copia duplicada"}
                        </span>
                      ) : null}
                    </div>
                    <p>{selectedInvoice.summary}</p>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-card">
                      <h3>Datos clave</h3>
                      <dl className="data-grid">
                        <div><dt>Proveedor</dt><dd>{selectedInvoice.supplier}</dd></div>
                        <div><dt>Cliente</dt><dd>{selectedInvoice.customer}</dd></div>
                        <div><dt>Fecha factura</dt><dd>{formatDate(selectedInvoice.invoiceDate)}</dd></div>
                        <div><dt>Vencimiento</dt><dd>{formatDate(selectedInvoice.dueDate)}</dd></div>
                        <div><dt>Base</dt><dd>{formatCurrency(selectedInvoice.amountBase)}</dd></div>
                        <div><dt>IVA</dt><dd>{formatCurrency(selectedInvoice.amountTax)}</dd></div>
                        <div><dt>Total</dt><dd>{formatCurrency(selectedInvoice.amountTotal)}</dd></div>
                        <div><dt>Recibida</dt><dd>{formatDateTime(selectedInvoice.receivedAt)}</dd></div>
                      </dl>
                    </div>

                    <div className="detail-card">
                      <h3>Gestion</h3>
                      <div className="actions">
                        {["pending", "reviewing", "booked", "paid", "duplicate_hold"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`status-button ${selectedInvoice.status === status ? "active" : ""}`}
                            onClick={() => updateInvoice(selectedInvoice.id, { status })}
                          >
                            {statusLabel(status)}
                          </button>
                        ))}
                      </div>
                      <label className="field">
                        <span>Notas internas</span>
                        <textarea
                          value={selectedInvoice.localNote}
                          onChange={(event) => updateInvoice(selectedInvoice.id, { note: event.target.value })}
                          placeholder="Anota validaciones, pagos o incidencias..."
                        />
                      </label>
                    </div>

                    <div className="detail-card detail-wide">
                      <h3>Texto extraido</h3>
                      <pre className="excerpt">{selectedInvoice.excerpt}</pre>
                    </div>
                  </div>

                  {selectedGroup ? (
                    <div className="detail-card">
                      <h3>Comprobacion de duplicado</h3>
                      <p>
                        {selectedGroup.reason} Riesgo potencial: {formatCurrency(selectedGroup.duplicateImpact)}.
                      </p>
                      <div className="duplicate-review">
                        {selectedGroup.items.map((item) => (
                          <div
                            key={item.id}
                            className={`duplicate-line ${item.id === selectedInvoice.id ? "current" : ""}`}
                          >
                            <div>
                              <strong>{item.forwardedBy}</strong>
                              <p>
                                {item.subject}
                                <br />
                                {formatDateTime(item.receivedAt)}
                              </p>
                            </div>
                            <div className="chip-row">
                              <span className={`chip ${item.status}`}>{statusLabel(item.status)}</span>
                              <span className={`chip ${item.id === selectedGroup.canonicalId ? "canonical" : "duplicate"}`}>
                                {item.id === selectedGroup.canonicalId ? "Canonica" : "Duplicada"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="empty">Selecciona una factura para ver el detalle.</div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
