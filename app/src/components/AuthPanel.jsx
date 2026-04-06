export default function AuthPanel({
  email,
  message,
  error,
  pending,
  onEmailChange,
  onSubmit,
}) {
  return (
    <div className="gate-shell">
      <section className="gate-card">
        <p className="eyebrow">Supabase Auth</p>
        <h1>Accede con magic link</h1>
        <p className="gate-copy">
          La app usa Supabase Auth para que cada usuario vea solo sus propias
          facturas y sus grupos de duplicados.
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="tu@empresa.com"
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Enviando..." : "Enviar magic link"}
          </button>
        </form>

        {message ? <p className="notice notice-success">{message}</p> : null}
        {error ? <p className="notice notice-error">{error}</p> : null}
      </section>
    </div>
  );
}
