create or replace function public.seed_billing_snapshot(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  portabil_group_id uuid;
begin
  if auth.uid() is not null and auth.uid() <> target_user_id then
    raise exception 'target_user_id must match auth.uid() for authenticated requests';
  end if;

  insert into public.duplicate_groups (
    owner_user_id,
    fingerprint,
    detection_method,
    confidence,
    reason,
    review_status,
    duplicate_impact
  )
  values (
    target_user_id,
    'manual:portabil-ft-fa-2026-66',
    'manual',
    'high',
    'Clave de duplicado heredada del parser de adjuntos.',
    'open',
    373.96
  )
  on conflict (owner_user_id, fingerprint)
  do update set
    duplicate_impact = excluded.duplicate_impact,
    updated_at = timezone('utc', now())
  returning id into portabil_group_id;

  insert into public.email_messages (
    owner_user_id,
    gmail_message_id,
    label_name,
    subject,
    from_address,
    source_sender,
    forwarded_by,
    received_at,
    gmail_url
  )
  values
    (target_user_id, '19d4956a2592b358', '@CONTROL FACTURACION', 'Fwd: Ya tienes disponible tu factura de electricidad de Iberdrola', 'facturacion@dialogagroup.com', 'Iberdrola via Facturacion', 'Ziortza Garcia', '2026-04-01T13:58:12+02:00', 'https://mail.google.com/mail/#all/19d4956a2592b358'),
    (target_user_id, '19d4954f42662cb8', '@CONTROL FACTURACION', 'Fwd: TTM Telekom FZE 2026-03-01 - 2026-03-31 period invoice notification', 'bilgi@ttmgrup.com', 'TTM Telekom FZE Finance Team', 'Ziortza Garcia', '2026-04-01T13:56:23+02:00', 'https://mail.google.com/mail/#all/19d4954f42662cb8'),
    (target_user_id, '19d48f9af2485555', '@CONTROL FACTURACION', 'Fwd: PORTABIL - invoice Dialoga 2026.66', 'op82652c@portabil.pt', 'Contabilidade', 'Ziortza Garcia', '2026-04-01T12:16:41+02:00', 'https://mail.google.com/mail/#all/19d48f9af2485555'),
    (target_user_id, '19d48f7b9c0a9bac', '@CONTROL FACTURACION', 'Fwd: APNF - Portabilite Mars FA154418', 'danielle.roussel@apnf.fr', 'Danielle Roussel', 'Jaione Benito', '2026-04-01T12:14:31+02:00', 'https://mail.google.com/mail/#all/19d48f7b9c0a9bac'),
    (target_user_id, '19d48f73f487addd', '@CONTROL FACTURACION', 'Fwd: PORTABIL - invoice Dialoga 2026.66', 'op82652c@portabil.pt', 'Contabilidade', 'Jaione Benito', '2026-04-01T12:14:01+02:00', 'https://mail.google.com/mail/#all/19d48f73f487addd'),
    (target_user_id, '19d48e91761f0981', '@CONTROL FACTURACION', 'Fwd: FACTURA PARTENON', 'isabel@dialogagroup.com', 'Isabel Herreros', 'Jaione Benito', '2026-04-01T11:58:33+02:00', 'https://mail.google.com/mail/#all/19d48e91761f0981'),
    (target_user_id, '19d48ddcf917afeb', '@CONTROL FACTURACION', 'Fwd: MINUTA MES MARZO 2026', 'legal@amilibia-lavandero.com', 'Patricia Hernando', 'Ziortza Garcia', '2026-04-01T11:46:13+02:00', 'https://mail.google.com/mail/#all/19d48ddcf917afeb'),
    (target_user_id, '19d48d8f28af9646', '@CONTROL FACTURACION', 'Fwd: Factura Aeternal Mentis abril 2026 Torre Iberdrola', 'admin@dialogagroup.com', 'Carlos Valverde Rodriguez via Admin', 'Jaione Benito', '2026-04-01T11:40:54+02:00', 'https://mail.google.com/mail/#all/19d48d8f28af9646'),
    (target_user_id, '19d48d8768164cb3', '@CONTROL FACTURACION', 'Fwd: Factura Dialoga abril 2026 Torre Iberdrola', 'admin@dialogagroup.com', 'Carlos Valverde Rodriguez via Admin', 'Jaione Benito', '2026-04-01T11:40:23+02:00', 'https://mail.google.com/mail/#all/19d48d8768164cb3')
  on conflict (owner_user_id, gmail_message_id) do nothing;

  insert into public.invoice_occurrences (
    owner_user_id,
    email_message_id,
    duplicate_group_id,
    duplicate_role,
    source_attachment_key,
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
    fingerprint_fallback
  )
  values
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d4956a2592b358'),
      null,
      null,
      'gmail:19d4956a2592b358:868296156_2026-03-30-16.42.29.001881.pdf',
      'Iberdrola Clientes, S.A.U.',
      'Operadora de Telecomunicaciones Opera S.L.',
      '21260330010201602',
      '2026-03-30',
      '2026-04-07',
      32.40,
      3.46,
      35.86,
      'EUR',
      'suministro',
      '868296156_2026-03-30-16.42.29.001881.pdf',
      '2026-02-23 / 2026-03-25',
      'high',
      'Factura de electricidad del suministro de Logrono. El PDF trae numero de contrato, periodo y fecha prevista de cobro.',
      'N FACTURA: 21260330010201602 | Periodo 23/02/2026 - 25/03/2026 | TOTAL 35,86 EUR | FECHA PREVISTA DE COBRO 07/04/2026.',
      'pending',
      '',
      null,
      'iberdrolaclientes|21260330010201602|35.86',
      '86829615620260330164229001881|35.86',
      'iberdrolaclientes|2026-03-30|35.86'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d4954f42662cb8'),
      null,
      null,
      'gmail:19d4954f42662cb8:20260331FZE19925890191.pdf',
      'TTM Telekom FZE',
      'Dialoga Interactive Services SA',
      '199258',
      '2026-03-31',
      '2026-04-01',
      515.90,
      0,
      515.90,
      'EUR',
      'telecom',
      '20260331FZE19925890191.pdf',
      '2026-03-01 / 2026-03-31',
      'high',
      'Factura de trafico y servicios de TTM. Vencimiento inmediato, un dia despues de la emision.',
      'INVOICE # 199258 | Invoice Date 31/03/2026 | Due Date 01/04/2026 | Total 515,90 EUR.',
      'pending',
      '',
      null,
      'ttmtelekomfze|199258|515.90',
      '20260331fze19925890191|515.90',
      'ttmtelekomfze|2026-03-31|515.90'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48f9af2485555'),
      portabil_group_id,
      'canonical',
      'gmail:19d48f9af2485555:Fatura FT FA.2026.66 Dialoga.pdf',
      'Portabil - Portabilidade em Telecomunicacoes, S.A.',
      'Dialoga Servicios Interactivos, S.A.',
      'FT FA.2026/66',
      '2026-04-01',
      '2026-05-31',
      373.96,
      0,
      373.96,
      'EUR',
      'telecom',
      'Fatura FT FA.2026.66 Dialoga.pdf',
      'Mayo 2026',
      'high',
      'Factura mensual de Portabil a 60 dias. Detectada duplicada porque aparece reenviada por dos personas distintas.',
      'Fatura FT FA.2026/66 | Data 2026-04-01 | Vencimento 2026-05-31 | Total 373,96 EUR.',
      'pending',
      '',
      'portabil-ft-fa-2026-66',
      'portabilportabilidadeemtelecomunicacoes|ftfa202666|373.96',
      'faturaftfa202666dialoga|373.96',
      'portabilportabilidadeemtelecomunicacoes|2026-04-01|373.96'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48f7b9c0a9bac'),
      null,
      null,
      'gmail:19d48f7b9c0a9bac:ALNI00_-_Facture_APNF_-FA154418_ - _ALNILAM.pdf',
      'APNF',
      'ALNILAM / Billing FR',
      'FA154418',
      '2026-03-31',
      '2026-05-15',
      375.40,
      75.08,
      450.48,
      'EUR',
      'portabilidad',
      'ALNI00_-_Facture_APNF_-FA154418_ - _ALNILAM.pdf',
      'Marzo 2026',
      'high',
      'Factura francesa de APNF con servicio de alimentacion, VPN y numeros portados.',
      'Facture N FA154418 | Du 31/03/2026 | Net a payer 450,48 EUR | Payable le 15/05/2026.',
      'pending',
      '',
      null,
      'apnf|fa154418|450.48',
      'alni00factureapnffa154418alnilam|450.48',
      'apnf|2026-03-31|450.48'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48f73f487addd'),
      portabil_group_id,
      'duplicate',
      'gmail:19d48f73f487addd:Fatura FT FA.2026.66 Dialoga.pdf',
      'Portabil - Portabilidade em Telecomunicacoes, S.A.',
      'Dialoga Servicios Interactivos, S.A.',
      'FT FA.2026/66',
      '2026-04-01',
      '2026-05-31',
      373.96,
      0,
      373.96,
      'EUR',
      'telecom',
      'Fatura FT FA.2026.66 Dialoga.pdf',
      'Mayo 2026',
      'high',
      'Misma factura de Portabil reenviada por otro remitente interno. Conviene decidir cual es el correo canonico.',
      'Fatura FT FA.2026/66 | Data 2026-04-01 | Vencimento 2026-05-31 | Total 373,96 EUR.',
      'duplicate_hold',
      '',
      'portabil-ft-fa-2026-66',
      'portabilportabilidadeemtelecomunicacoes|ftfa202666|373.96',
      'faturaftfa202666dialoga|373.96',
      'portabilportabilidadeemtelecomunicacoes|2026-04-01|373.96'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48e91761f0981'),
      null,
      null,
      'gmail:19d48e91761f0981:P2600002_OPERADORA_DE_TELECOMUNICACIONES_OPERA_S_L_.pdf',
      'Partenon Consulting Inmobiliario S.L.',
      'Operadora de Telecomunicaciones Opera S.L.',
      'P2600002',
      '2026-04-01',
      '2026-04-20',
      6000.00,
      1260.00,
      7260.00,
      'EUR',
      'alquiler',
      'P2600002_OPERADORA_DE_TELECOMUNICACIONES_OPERA_S_L_.pdf',
      'Abril 2026 - Junio 2026',
      'high',
      'Factura de alquiler de oficina y garaje con tres mensualidades en un solo documento.',
      'FACTURA n: P2600002 | SUBTOTAL 6.000,00 EUR | IVA 1.260,00 EUR | TOTAL 7.260,00 EUR | Vencimiento 20/04/2026.',
      'pending',
      '',
      null,
      'partenonconsultinginmobiliario|p2600002|7260.00',
      'p2600002operadoradetelecomunicacionesoperasl|7260.00',
      'partenonconsultinginmobiliario|2026-04-01|7260.00'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48ddcf917afeb'),
      null,
      null,
      'gmail:19d48ddcf917afeb:068.26.4 Dialoga.pdf',
      'Amilibia y Lavandero Abogados, S.L.P.',
      'Dialoga Servicios Interactivos, S.A.',
      '2026/68',
      '2026-03-31',
      '2026-03-31',
      10500.00,
      2205.00,
      12705.00,
      'EUR',
      'servicios juridicos',
      '068.26.4 Dialoga.pdf',
      'Marzo 2026',
      'high',
      'Minuta juridica de marzo con vencimiento en la misma fecha de expedicion. Punto de atencion prioritaria.',
      'Factura 2026 / 68 | Fecha 31-03-2026 | Vencimiento 31-03-2026 | Total 12.705,00 EUR.',
      'pending',
      '',
      null,
      'amilibiaylavanderoabogados|202668|12705.00',
      '068264dialoga|12705.00',
      'amilibiaylavanderoabogados|2026-03-31|12705.00'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48d8f28af9646'),
      null,
      null,
      'gmail:19d48d8f28af9646:FA-TI-260099000308 AETERNAL MENTIS abril 2026.pdf',
      'Torre Iberdrola, A.I.E.',
      'Aeternal Mentis, S.A.',
      '26/0099/000308',
      '2026-04-01',
      null,
      2797.04,
      587.38,
      3384.42,
      'EUR',
      'alquiler',
      'FA-TI-260099000308 AETERNAL MENTIS abril 2026.pdf',
      'Abril 2026',
      'medium',
      'Factura de Torre Iberdrola para Aeternal Mentis. El PDF trae importes pero no deja una fecha de vencimiento clara.',
      'FACTURA N 26/0099/000308 | Base 2.797,04 EUR | IVA 587,38 EUR | TOTAL 3.384,42 EUR.',
      'pending',
      '',
      null,
      'torreiberdrola|260099000308|3384.42',
      'fati260099000308aeternalmentisabril2026|3384.42',
      'torreiberdrola|2026-04-01|3384.42'
    ),
    (
      target_user_id,
      (select id from public.email_messages where owner_user_id = target_user_id and gmail_message_id = '19d48d8768164cb3'),
      null,
      null,
      'gmail:19d48d8768164cb3:FA-TI-260099000290 DIALOGA abril 2026.pdf',
      'Torre Iberdrola, A.I.E.',
      'Dialoga Servicios Interactivos, S.A.',
      '26/0099/000290',
      '2026-04-01',
      null,
      51913.28,
      10901.79,
      62815.07,
      'EUR',
      'alquiler',
      'FA-TI-260099000290 DIALOGA abril 2026.pdf',
      'Abril 2026',
      'medium',
      'Factura principal de Torre Iberdrola para Dialoga con renta, gastos comunes y parking.',
      'FACTURA N 26/0099/000290 | Base 51.913,28 EUR | IVA 10.901,79 EUR | TOTAL 62.815,07 EUR.',
      'pending',
      '',
      null,
      'torreiberdrola|260099000290|62815.07',
      'fati260099000290dialogaabril2026|62815.07',
      'torreiberdrola|2026-04-01|62815.07'
    )
  on conflict (owner_user_id, source_attachment_key) do nothing;

  update public.duplicate_groups
  set canonical_occurrence_id = (
    select io.id
    from public.invoice_occurrences io
    where io.owner_user_id = target_user_id
      and io.duplicate_group_id = portabil_group_id
      and io.duplicate_role = 'canonical'
    limit 1
  )
  where id = portabil_group_id;
end;
$$;

comment on function public.seed_billing_snapshot(uuid)
is 'Carga un snapshot inicial de la etiqueta @CONTROL FACTURACION para un usuario concreto.';

revoke all on function public.seed_billing_snapshot(uuid) from public;
grant execute on function public.seed_billing_snapshot(uuid) to authenticated;
