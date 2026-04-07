import { startTransition, useDeferredValue, useEffect, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import ConfigPanel from "./components/ConfigPanel";
import FiltersBar from "./components/FiltersBar";
import DuplicateRadar from "./components/DuplicateRadar";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceList from "./components/InvoiceList";
import SummaryCards from "./components/SummaryCards";
import {
  fetchInvoiceOccurrences,
  sendMagicLink,
  signOutFromSupabase,
  updateInvoiceOccurrenceNote,
  updateInvoiceOccurrenceStatus,
} from "./lib/billingApi";
import { buildDuplicateState } from "./lib/duplicates";
import { getDueBucket } from "./lib/format";
import { hasSupabaseEnv, supabase } from "./lib/supabaseClient";

function buildSummary(invoices, groups) {
  const duplicateIds = new Set(groups.flatMap((group) => group.itemIds));
  const canonicalIds = new Set(groups.map((group) => group.canonicalId));
  const correctedTotal = invoices.reduce((sum, invoice) => {
    if (!duplicateIds.has(invoice.id)) return sum + invoice.amountTotal;
    if (canonicalIds.has(invoice.id)) return sum + invoice.amountTotal;
    return sum;
  }, 0);

  const unresolvedDuplicateGroups = groups.filter((group) =>
    group.items.some((invoice) => invoice.id !== group.canonicalId && invoice.status !== "duplicate_hold")
  ).length;

  return {
    totalInvoices: invoices.length,
    correctedTotal,
    duplicateImpact: groups.reduce((sum, group) => sum + group.duplicateImpact, 0),
    duplicateGroups: groups.length,
    unresolvedDuplicateGroups,
    overdueCount: invoices.filter((invoice) => invoice.dueInfo.bucket === "overdue").length,
    todayCount: invoices.filter((invoice) => invoice.dueInfo.bucket === "today").length,
    urgentCount: invoices.filter((invoice) => {
      return invoice.dueInfo.bucket === "overdue" || invoice.dueInfo.bucket === "today";
    }).length,
  };
}

function filterInvoices(invoices, filters, searchTerm) {
  return invoices.filter((invoice) => {
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

    if (searchTerm && !haystack.includes(searchTerm)) return false;
    if (filters.supplier !== "all" && invoice.supplier !== filters.supplier) return false;
    if (filters.status !== "all" && invoice.status !== filters.status) return false;
    if (filters.due !== "all" && invoice.dueInfo.bucket !== filters.due) return false;

    if (filters.duplicates === "only" && !invoice.duplicate) return false;
    if (filters.duplicates === "hide" && invoice.duplicate?.role === "duplicate") return false;
    if (filters.canonicalOnly && invoice.duplicate?.role === "duplicate") return false;

    return true;
  });
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function prepareInvoices(records) {
  const withDueInfo = records.map((record) => ({
    ...record,
    dueInfo: getDueBucket(record.dueDate, getTodayString()),
  }));

  const { groups, duplicateMetaByInvoiceId } = buildDuplicateState(withDueInfo);
  const invoices = withDueInfo
    .map((invoice) => ({
      ...invoice,
      duplicate: duplicateMetaByInvoiceId[invoice.id] || null,
    }))
    .sort((left, right) => {
      const receivedDelta = new Date(right.receivedAt) - new Date(left.receivedAt);
      if (receivedDelta !== 0) return receivedDelta;
      return right.amountTotal - left.amountTotal;
    });

  const hydratedGroups = groups.map((group) => ({
    ...group,
    itemIds: group.items.map((item) => item.id),
  }));

  return { invoices, groups: hydratedGroups };
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(hasSupabaseEnv);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [mutationError, setMutationError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    supplier: "all",
    status: "all",
    due: "all",
    duplicates: "all",
    canonicalOnly: false,
  });

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          setAuthError(error.message);
        }

        setSession(data.session || null);
        setAuthLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        setAuthError(error.message);
        setAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession || null);
      setAuthLoading(false);
      setAuthError("");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setRecords([]);
      setSelectedId(null);
      return;
    }

    let active = true;
    setRecordsLoading(true);
    setRecordsError("");

    fetchInvoiceOccurrences()
      .then((rows) => {
        if (!active) return;
        setRecords(rows);
        if (!selectedId && rows[0]) {
          setSelectedId(rows[0].id);
        }
      })
      .catch((error) => {
        if (!active) return;
        setRecordsError(error.message);
      })
      .finally(() => {
        if (!active) return;
        setRecordsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session]);

  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());
  const prepared = prepareInvoices(records);
  const summary = buildSummary(prepared.invoices, prepared.groups);
  const visibleInvoices = filterInvoices(prepared.invoices, filters, deferredSearch);
  const suppliers = [...new Set(prepared.invoices.map((invoice) => invoice.supplier))].sort();

  const selectedInvoice =
    visibleInvoices.find((invoice) => invoice.id === selectedId) ||
    prepared.invoices.find((invoice) => invoice.id === selectedId) ||
    visibleInvoices[0] ||
    prepared.invoices[0] ||
    null;

  const selectedDuplicateGroup = selectedInvoice?.duplicate
    ? prepared.groups.find((group) => group.id === selectedInvoice.duplicate.groupId)
    : null;

  useEffect(() => {
    if (!selectedInvoice && prepared.invoices[0]) {
      setSelectedId(prepared.invoices[0].id);
    }
  }, [prepared.invoices, selectedInvoice]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);

    try {
      await sendMagicLink(authEmail.trim());
      setAuthMessage("Revisa tu correo: te hemos enviado un magic link.");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    setAuthError("");
    await signOutFromSupabase();
  }

  async function handleStatusChange(invoiceId, status) {
    setMutationError("");
    setSavingStatusId(invoiceId);

    try {
      const updated = await updateInvoiceOccurrenceStatus(invoiceId, status);
      setRecords((current) =>
        current.map((record) =>
          record.id === updated.id
            ? {
                ...record,
                status: updated.workflowStatus,
              }
            : record
        )
      );
    } catch (error) {
      setMutationError(error.message);
    } finally {
      setSavingStatusId(null);
    }
  }

  async function handleNoteSave(invoiceId, note) {
    setMutationError("");
    setSavingNoteId(invoiceId);

    try {
      const updated = await updateInvoiceOccurrenceNote(invoiceId, note);
      setRecords((current) =>
        current.map((record) =>
          record.id === updated.id
            ? {
                ...record,
                localNote: updated.internalNote,
              }
            : record
        )
      );
    } catch (error) {
      setMutationError(error.message);
    } finally {
      setSavingNoteId(null);
    }
  }

  function handleSearchChange(event) {
    const nextValue = event.target.value;
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        search: nextValue,
      }));
    });
  }

  function handleFilterChange(key, value) {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    });
  }

  if (!hasSupabaseEnv) {
    return <ConfigPanel />;
  }

  if (authLoading && !session && !authMessage) {
    return (
      <div className="gate-shell">
        <div className="gate-card">
          <p className="eyebrow">Conectando</p>
          <h1>Cargando sesion</h1>
          <p className="gate-copy">
            Estamos comprobando tu sesion de Supabase.
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthPanel
        email={authEmail}
        message={authMessage}
        error={authError}
        pending={authLoading}
        onEmailChange={setAuthEmail}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-copy">
          <div className="hero-topline">
            <p className="eyebrow">@CONTROL FACTURACION</p>
            <div className="hero-account">
              <span>{session.user.email}</span>
              <button type="button" className="secondary-button" onClick={handleSignOut}>
                Cerrar sesion
              </button>
            </div>
          </div>
          <h1>Frontend React con BBDD real en Supabase</h1>
          <p className="hero-text">
            La app ya no guarda estados en el navegador: lee y escribe contra
            Supabase, con autenticacion real, RLS por usuario y persistencia de
            grupos de duplicados.
          </p>
          <p className="hero-meta">
            Dataset actual: {prepared.invoices.length} ocurrencia(s) en base de
            datos.
          </p>
        </div>

        <div className="hero-side">
          <p className="mini-kicker">Regla operativa</p>
          <h2>No sumar correos. Sumar facturas canonicas.</h2>
          <p>
            El modelo persiste <code>email_messages</code>,{" "}
            <code>invoice_occurrences</code> y <code>duplicate_groups</code>.
            Si un grupo no viene resuelto desde la base, la interfaz sugiere
            duplicados con las huellas almacenadas.
          </p>
        </div>
      </header>

      {recordsError ? <p className="notice notice-error">{recordsError}</p> : null}

      <SummaryCards summary={summary} />

      <FiltersBar
        filters={filters}
        suppliers={suppliers}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onToggleCanonicalOnly={(checked) => handleFilterChange("canonicalOnly", checked)}
      />

      <main className="workspace-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Bandeja</p>
              <h2>Facturas recibidas</h2>
            </div>
            <p className="panel-note">{visibleInvoices.length} resultado(s) visibles</p>
          </div>

          {recordsLoading ? (
            <div className="empty-card">Cargando datos desde Supabase...</div>
          ) : visibleInvoices.length ? (
            <InvoiceList invoices={visibleInvoices} selectedId={selectedInvoice?.id} onSelect={setSelectedId} />
          ) : (
            <div className="empty-card">
              No hay datos en la base todavia. Ejecuta{" "}
              <code>supabase/schema.sql</code> y, si quieres una demo inmediata,
              corre la funcion <code>seed_billing_snapshot(...)</code>.
            </div>
          )}
        </section>

        <div className="side-column">
          <DuplicateRadar groups={prepared.groups} selectedId={selectedInvoice?.id} onSelect={setSelectedId} />

          <InvoiceDetail
            invoice={selectedInvoice}
            duplicateGroup={selectedDuplicateGroup}
            savingStatusId={savingStatusId}
            savingNoteId={savingNoteId}
            mutationError={mutationError}
            onStatusChange={handleStatusChange}
            onNoteSave={handleNoteSave}
          />
        </div>
      </main>
    </div>
  );
}
