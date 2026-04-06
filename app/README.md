# Billing Tracking App

App React/Vite para seguimiento de facturas con foco en deteccion de duplicados.

## Como usar en Netlify

- Repositorio: `Wollland/billingtracking`
- Branch recomendada: `codex/billingtracking-react`
- Base directory: `app`
- Build command: `npm run build`
- Publish directory: `dist`

## Punto clave

La app no suma todos los correos como si fueran facturas distintas. Primero agrupa duplicados y luego calcula un total corregido usando una sola factura canonica por grupo.

## Reglas de duplicado

1. `duplicateKey` heredada del parser.
2. Proveedor + numero de factura + importe total.
3. Nombre del PDF + importe total.
4. Proveedor + fecha de factura + importe total.

## Estado actual

El dataset incluido es un snapshot inicial de correos recientes de `@CONTROL FACTURACION`.
Los estados y notas se guardan en `localStorage` del navegador.
