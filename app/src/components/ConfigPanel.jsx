export default function ConfigPanel() {
  return (
    <div className="gate-shell">
      <section className="gate-card">
        <p className="eyebrow">Config</p>
        <h1>Falta conectar Supabase</h1>
        <p className="gate-copy">
          Esta version ya no trabaja con datos embebidos. Necesita una base
          real y variables de entorno para arrancar.
        </p>

        <div className="setup-list">
          <div className="setup-item">
            <strong>1. Variables</strong>
            <p>
              Crea un archivo <code>.env</code> con <code>VITE_SUPABASE_URL</code>,
              <code>VITE_SUPABASE_ANON_KEY</code> y, opcionalmente,
              <code>VITE_SUPABASE_EMAIL_REDIRECT_URL</code>.
            </p>
          </div>
          <div className="setup-item">
            <strong>2. SQL</strong>
            <p>
              Ejecuta <code>supabase/schema.sql</code> y luego, si quieres datos
              de ejemplo, <code>supabase/seed_snapshot.sql</code>.
            </p>
          </div>
          <div className="setup-item">
            <strong>3. Auth</strong>
            <p>
              Habilita Email Auth en Supabase. La app inicia sesion con magic
              link.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
