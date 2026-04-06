export function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getDueBucket(dueDate, currentDate) {
  if (!dueDate) {
    return { bucket: "unknown", label: "Sin fecha" };
  }

  const current = new Date(`${currentDate}T00:00:00`);
  const due = new Date(`${dueDate}T00:00:00`);
  const deltaDays = Math.floor((due - current) / 86400000);

  if (deltaDays < 0) return { bucket: "overdue", label: "Vencida" };
  if (deltaDays === 0) return { bucket: "today", label: "Vence hoy" };
  return { bucket: "upcoming", label: "Proxima" };
}

export function statusLabel(status) {
  return {
    pending: "Pendiente",
    reviewing: "En revision",
    booked: "Contabilizada",
    paid: "Pagada",
    duplicate_hold: "Duplicada retenida",
  }[status] || "Pendiente";
}
