create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.duplicate_groups (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  fingerprint text not null,
  detection_method text not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  reason text not null,
  review_status text not null default 'open' check (review_status in ('open', 'resolved')),
  duplicate_impact numeric(12, 2) not null default 0,
  canonical_occurrence_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (owner_user_id, fingerprint)
);

create table if not exists public.email_messages (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  gmail_message_id text not null,
  label_name text,
  subject text not null,
  from_address text,
  source_sender text,
  forwarded_by text,
  received_at timestamptz,
  gmail_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (owner_user_id, gmail_message_id)
);

create table if not exists public.invoice_occurrences (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  email_message_id uuid not null references public.email_messages(id) on delete cascade,
  duplicate_group_id uuid references public.duplicate_groups(id) on delete set null,
  duplicate_role text check (duplicate_role in ('canonical', 'duplicate')),
  source_attachment_key text not null,
  supplier_name text not null,
  customer_name text,
  invoice_number text,
  invoice_date date,
  due_date date,
  amount_base numeric(12, 2) not null default 0,
  amount_tax numeric(12, 2) not null default 0,
  amount_total numeric(12, 2) not null default 0,
  currency text not null default 'EUR',
  category text,
  attachment_filename text,
  period_text text,
  extraction_confidence text not null default 'medium' check (extraction_confidence in ('high', 'medium', 'low')),
  summary text,
  excerpt text,
  workflow_status text not null default 'pending' check (workflow_status in ('pending', 'reviewing', 'booked', 'paid', 'duplicate_hold')),
  internal_note text not null default '',
  fingerprint_manual text,
  fingerprint_invoice text,
  fingerprint_file text,
  fingerprint_fallback text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (owner_user_id, source_attachment_key)
);

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'duplicate_groups_canonical_occurrence_id_fkey'
      and table_name = 'duplicate_groups'
  ) then
    alter table public.duplicate_groups
      add constraint duplicate_groups_canonical_occurrence_id_fkey
      foreign key (canonical_occurrence_id)
      references public.invoice_occurrences(id)
      on delete set null;
  end if;
end
$$;

create index if not exists idx_duplicate_groups_owner on public.duplicate_groups(owner_user_id);
create index if not exists idx_email_messages_owner on public.email_messages(owner_user_id);
create index if not exists idx_invoice_occurrences_owner on public.invoice_occurrences(owner_user_id);
create index if not exists idx_invoice_occurrences_duplicate_group on public.invoice_occurrences(duplicate_group_id);
create index if not exists idx_invoice_occurrences_invoice_number on public.invoice_occurrences(invoice_number);
create index if not exists idx_invoice_occurrences_due_date on public.invoice_occurrences(due_date);
create index if not exists idx_invoice_occurrences_attachment_key on public.invoice_occurrences(source_attachment_key);
create index if not exists idx_invoice_occurrences_fingerprint_invoice on public.invoice_occurrences(fingerprint_invoice);
create index if not exists idx_invoice_occurrences_fingerprint_file on public.invoice_occurrences(fingerprint_file);

drop trigger if exists trg_duplicate_groups_touch_updated_at on public.duplicate_groups;
create trigger trg_duplicate_groups_touch_updated_at
before update on public.duplicate_groups
for each row execute function public.touch_updated_at();

drop trigger if exists trg_email_messages_touch_updated_at on public.email_messages;
create trigger trg_email_messages_touch_updated_at
before update on public.email_messages
for each row execute function public.touch_updated_at();

drop trigger if exists trg_invoice_occurrences_touch_updated_at on public.invoice_occurrences;
create trigger trg_invoice_occurrences_touch_updated_at
before update on public.invoice_occurrences
for each row execute function public.touch_updated_at();

alter table public.duplicate_groups enable row level security;
alter table public.email_messages enable row level security;
alter table public.invoice_occurrences enable row level security;

drop policy if exists "duplicate_groups_select_own" on public.duplicate_groups;
create policy "duplicate_groups_select_own"
on public.duplicate_groups
for select
to authenticated
using ((select auth.uid()) = owner_user_id);

drop policy if exists "duplicate_groups_insert_own" on public.duplicate_groups;
create policy "duplicate_groups_insert_own"
on public.duplicate_groups
for insert
to authenticated
with check ((select auth.uid()) = owner_user_id);

drop policy if exists "duplicate_groups_update_own" on public.duplicate_groups;
create policy "duplicate_groups_update_own"
on public.duplicate_groups
for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

drop policy if exists "duplicate_groups_delete_own" on public.duplicate_groups;
create policy "duplicate_groups_delete_own"
on public.duplicate_groups
for delete
to authenticated
using ((select auth.uid()) = owner_user_id);

drop policy if exists "email_messages_select_own" on public.email_messages;
create policy "email_messages_select_own"
on public.email_messages
for select
to authenticated
using ((select auth.uid()) = owner_user_id);

drop policy if exists "email_messages_insert_own" on public.email_messages;
create policy "email_messages_insert_own"
on public.email_messages
for insert
to authenticated
with check ((select auth.uid()) = owner_user_id);

drop policy if exists "email_messages_update_own" on public.email_messages;
create policy "email_messages_update_own"
on public.email_messages
for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

drop policy if exists "email_messages_delete_own" on public.email_messages;
create policy "email_messages_delete_own"
on public.email_messages
for delete
to authenticated
using ((select auth.uid()) = owner_user_id);

drop policy if exists "invoice_occurrences_select_own" on public.invoice_occurrences;
create policy "invoice_occurrences_select_own"
on public.invoice_occurrences
for select
to authenticated
using ((select auth.uid()) = owner_user_id);

drop policy if exists "invoice_occurrences_insert_own" on public.invoice_occurrences;
create policy "invoice_occurrences_insert_own"
on public.invoice_occurrences
for insert
to authenticated
with check ((select auth.uid()) = owner_user_id);

drop policy if exists "invoice_occurrences_update_own" on public.invoice_occurrences;
create policy "invoice_occurrences_update_own"
on public.invoice_occurrences
for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

drop policy if exists "invoice_occurrences_delete_own" on public.invoice_occurrences;
create policy "invoice_occurrences_delete_own"
on public.invoice_occurrences
for delete
to authenticated
using ((select auth.uid()) = owner_user_id);
