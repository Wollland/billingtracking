import { supabase } from "./supabaseClient";

const OCCURRENCE_SELECT = `
  id,
  email_message_id,
  duplicate_group_id,
  duplicate_role,
  supplier_name,
  customer_name,
  invoice_number,
  invoice_date,
  due_date,
  amount_base,
  amount_tax,
  amount_total,
  currency,
  category,
  attachment_filename,
  period_text,
  extraction_confidence,
  summary,
  excerpt,
  workflow_status,
  internal_note,
  fingerprint_manual,
  fingerprint_invoice,
  fingerprint_file,
  fingerprint_fallback,
  created_at,
  updated_at,
  email_messages:email_messages!invoice_occurrences_email_message_id_fkey (
    id,
    gmail_message_id,
    label_name,
    subject,
    from_address,
    source_sender,
    forwarded_by,
    received_at,
    gmail_url
  ),
  duplicate_group:duplicate_groups!invoice_occurrences_duplicate_group_id_fkey (
    id,
    fingerprint,
    detection_method,
    confidence,
    reason,
    review_status,
    duplicate_impact,
    canonical_occurrence_id
  )
`;

function unwrapSingleRelation(value) {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

function toNumber(value) {
  return Number(value || 0);
}

export function mapOccurrenceRow(row) {
  const email = unwrapSingleRelation(row.email_messages) || {};
  const duplicateGroup = unwrapSingleRelation(row.duplicate_group);

  return {
    id: row.id,
    emailMessageId: row.email_message_id,
    duplicateGroupId: row.duplicate_group_id,
    duplicateRole: row.duplicate_role,
    supplier: row.supplier_name,
    customer: row.customer_name,
    invoiceNumber: row.invoice_number,
    invoiceDate: row.invoice_date,
    dueDate: row.due_date,
    amountBase: toNumber(row.amount_base),
    amountTax: toNumber(row.amount_tax),
    amountTotal: toNumber(row.amount_total),
    currency: row.currency || "EUR",
    category: row.category,
    attachmentFilename: row.attachment_filename,
    period: row.period_text,
    extractionConfidence: row.extraction_confidence,
    summary: row.summary,
    excerpt: row.excerpt,
    status: row.workflow_status,
    localNote: row.internal_note || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    subject: email.subject || "Sin asunto",
    fromAddress: email.from_address || "",
    sourceSender: email.source_sender || email.from_address || "",
    forwardedBy: email.forwarded_by || "",
    receivedAt: email.received_at || row.created_at,
    gmailUrl: email.gmail_url || "",
    labelName: email.label_name || "",
    gmailMessageId: email.gmail_message_id || "",
    fingerprints: {
      manual: row.fingerprint_manual,
      invoice: row.fingerprint_invoice,
      file: row.fingerprint_file,
      fallback: row.fingerprint_fallback,
    },
    persistedGroup: duplicateGroup
      ? {
          id: duplicateGroup.id,
          fingerprint: duplicateGroup.fingerprint,
          detectionMethod: duplicateGroup.detection_method,
          confidence: duplicateGroup.confidence,
          reason: duplicateGroup.reason,
          reviewStatus: duplicateGroup.review_status,
          duplicateImpact: toNumber(duplicateGroup.duplicate_impact),
          canonicalOccurrenceId: duplicateGroup.canonical_occurrence_id,
        }
      : null,
  };
}

export async function fetchInvoiceOccurrences() {
  const { data, error } = await supabase
    .from("invoice_occurrences")
    .select(OCCURRENCE_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(mapOccurrenceRow);
}

export async function sendMagicLink(email) {
  const redirectTo =
    import.meta.env.VITE_SUPABASE_EMAIL_REDIRECT_URL || window.location.origin;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOutFromSupabase() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function updateInvoiceOccurrenceStatus(id, workflowStatus) {
  const { data, error } = await supabase
    .from("invoice_occurrences")
    .update({
      workflow_status: workflowStatus,
    })
    .eq("id", id)
    .select("id, workflow_status")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    workflowStatus: data.workflow_status,
  };
}

export async function updateInvoiceOccurrenceNote(id, internalNote) {
  const { data, error } = await supabase
    .from("invoice_occurrences")
    .update({
      internal_note: internalNote,
    })
    .eq("id", id)
    .select("id, internal_note")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    internalNote: data.internal_note || "",
  };
}
