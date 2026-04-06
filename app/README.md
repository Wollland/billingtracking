# Control Facturacion React + Supabase

Aplicacion React preparada para Netlify con persistencia real en Supabase.

## Arquitectura

La app usa tres tablas y una clave estable de importacion:

- `email_messages`: un registro por correo de Gmail.
- `invoice_occurrences`: una ocurrencia por factura detectada en un adjunto.
- `duplicate_groups`: grupos persistidos de facturas repetidas.
- `source_attachment_key`: clave estable dentro de `invoice_occurrences` para no reimportar dos veces la misma ocurrencia.

La interfaz calcula el total corregido tomando solo la ocurrencia canonica de cada grupo. Si una ocurrencia no viene agrupada desde base, el frontend puede sugerir duplicados usando las huellas guardadas en la tabla.

## Auth y seguridad

- Login por magic link con Supabase Auth.
- RLS activado en todas las tablas.
- Cada usuario solo ve y modifica filas con `owner_user_id = auth.uid()`.

## Ficheros clave

- `src/App.jsx`
- `src/lib/billingApi.js`
- `src/lib/duplicates.js`
- `supabase/schema.sql`
- `supabase/seed_snapshot.sql`

## Variables de entorno

Usa `.env.example` como base:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_EMAIL_REDIRECT_URL=
```

## Puesta en marcha

1. Crea un proyecto de Supabase.
2. Ejecuta `supabase/schema.sql` en el SQL editor.
3. Crea o inicia sesion con un usuario de Supabase Auth.
4. Si quieres datos de ejemplo, ejecuta:

```sql
select public.seed_billing_snapshot('<TU_USER_ID>'::uuid);
```

5. Configura las variables de entorno.
6. Ejecuta:

```bash
npm install
npm run dev
```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `public/_redirects`
- Netlify config: `netlify.toml`

## Estado actual

- La parte frontend + Supabase queda preparada.
- El esquema ya evita reimportar la misma ocurrencia usando `source_attachment_key`.
- La funcion `seed_billing_snapshot` es idempotente y no queda expuesta al rol publico.
- El importador automático desde Gmail a Supabase todavia no existe en esta iteracion.
- No he podido ejecutar `npm install` ni `npm run build` aqui porque esta maquina no tiene Node operativo.
