-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- Holds customer names, phone numbers, birthdays, and anniversaries so the
-- private /admin/customers page can remind the owner who to wish each day.
--
-- IMPORTANT: unlike feedback/subscribers, this table needs to be READABLE
-- (not just insertable) so the admin page can show "today's wishes". That
-- read access is granted to the anon key below, which our /api/admin/*
-- routes use server-side only (never sent to the browser) and gate behind
-- a passcode (ADMIN_PASSCODE env var). If you'd rather this real customer
-- data (name/phone/birthdate) not be reachable by anyone who ever obtains
-- the anon key, get the "service_role" secret key instead from Supabase
-- (Project Settings > API) and tell your developer to swap it in — then
-- this table's RLS can stay fully locked with zero anon policies, exactly
-- like the feedback and subscribers tables.

create table if not exists public.customer_dates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  mobile text not null,
  dob date,
  anniversary date,
  notes text
);

alter table public.customer_dates enable row level security;

drop policy if exists "Public can insert customer dates" on public.customer_dates;
create policy "Public can insert customer dates"
  on public.customer_dates
  for insert
  to anon
  with check (true);

drop policy if exists "Public can read customer dates" on public.customer_dates;
create policy "Public can read customer dates"
  on public.customer_dates
  for select
  to anon
  using (true);

drop policy if exists "Public can delete customer dates" on public.customer_dates;
create policy "Public can delete customer dates"
  on public.customer_dates
  for delete
  to anon
  using (true);
