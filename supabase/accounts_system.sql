-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- Replaces the single-shared-passcode /admin/customers tool with a unified
-- mobile-number + PIN login that serves BOTH the admin and customers from
-- one page (/account). Every account — admin or customer — is a row in
-- `customers`. Whether someone sees the admin dashboard or their own
-- simple points/referral view after logging in depends on `is_admin`.
--
-- Referral rule (as specified): when a customer orders, if they have a
-- `referred_by` mobile number on file, the REFERRER earns 10% of THAT
-- order's amount, every time — not just their first order. Points
-- (+3 per biryani) are a separate pride-counter with no cash value.
-- Redemption is manual (staff applies a discount in person) — the admin
-- dashboard just needs to show the current balance and flag it as
-- redeemable once it reaches ₹100.

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  mobile text not null unique,
  pin_hash text not null,
  is_admin boolean not null default false,
  dob date,
  anniversary date,
  notes text,
  referred_by text references public.customers(mobile) on delete set null,
  points int not null default 0,
  referral_balance numeric(10, 2) not null default 0,
  lifetime_referral_earned numeric(10, 2) not null default 0
);

create index if not exists customers_referred_by_idx on public.customers (referred_by);

-- One row per recorded sale, entered by the admin after an order (there's
-- no online checkout — orders happen over WhatsApp/phone, so staff log
-- them here). Kept as a permanent ledger/audit trail even though the
-- totals it produced are also rolled up onto the customer row above.
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_mobile text not null references public.customers(mobile) on delete cascade,
  biryani_count int not null check (biryani_count > 0),
  amount numeric(10, 2) not null check (amount >= 0),
  referrer_mobile text references public.customers(mobile) on delete set null,
  points_awarded int not null default 0,
  referral_bonus numeric(10, 2) not null default 0
);

create index if not exists purchases_customer_idx on public.purchases (customer_mobile);

-- Log of manual redemptions, so a referrer's balance can be reduced when
-- staff apply it as a discount, while keeping a record of when/how much.
create table if not exists public.redemptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_mobile text not null references public.customers(mobile) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  notes text
);

-- Per-mobile-number lockout (replaces the old single shared admin_lockout
-- row) — 3 wrong PIN attempts for a given mobile locks THAT account for
-- 5 minutes, doubling on each further lockout, exactly like before.
create table if not exists public.login_lockout (
  mobile text primary key,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  lockout_seconds int not null default 300,
  updated_at timestamptz not null default now()
);

-- One-time migration of whatever was already saved via the old
-- /admin/customers tool, so that data isn't lost. Safe to run even if
-- customer_dates doesn't exist or is empty. Skips rows whose mobile
-- number is already present in `customers`. These migrated rows have NO
-- pin_hash set yet (impossible to know their old PIN, because there
-- wasn't one) — see the note at the bottom of this file.
insert into public.customers (name, mobile, dob, anniversary, notes, pin_hash)
select cd.name, cd.mobile, cd.dob, cd.anniversary, cd.notes, ''
from public.customer_dates cd
where not exists (
  select 1 from public.customers c where c.mobile = cd.mobile
)
on conflict (mobile) do nothing;

alter table public.customers enable row level security;
alter table public.purchases enable row level security;
alter table public.redemptions enable row level security;
alter table public.login_lockout enable row level security;

-- All four tables need read + write via the anon key, same security
-- model as customer_dates before: the anon key is used server-side only
-- (inside /api/account/* routes, never sent to the browser), and actual
-- access control is enforced by our own login + PIN check in the API
-- layer, not by RLS. See the note in customer_dates_table.sql about
-- upgrading to the service_role key for stronger isolation.

drop policy if exists "Server can access customers" on public.customers;
create policy "Server can access customers" on public.customers
  for all to anon using (true) with check (true);

drop policy if exists "Server can access purchases" on public.purchases;
create policy "Server can access purchases" on public.purchases
  for all to anon using (true) with check (true);

drop policy if exists "Server can access redemptions" on public.redemptions;
create policy "Server can access redemptions" on public.redemptions
  for all to anon using (true) with check (true);

drop policy if exists "Server can access login_lockout" on public.login_lockout;
create policy "Server can access login_lockout" on public.login_lockout
  for all to anon using (true) with check (true);

-- Creates (or upgrades) the admin account with mobile 7330922131 — the
-- same number used everywhere else on the site — and PIN 1447 (change
-- this PIN the moment you've confirmed login works; see the README note
-- shared alongside this file for how). If a row for this mobile already
-- exists (e.g. migrated from customer_dates above), this just promotes it
-- to admin and sets its PIN rather than creating a duplicate.
insert into public.customers (name, mobile, pin_hash, is_admin)
values (
  'Bakasura Admin',
  '917330922131',
  '5efe135fa18d1ff1d15e6044e02b9959:761aa3b30ca29de6040daf561f0dacdefe8821fd8a16a02080e394beb2c3939f980c556fe67f35f3ca089845d960da9e20cd774c2b604da766ca9f33f2d8a94a',
  true
)
on conflict (mobile) do update
  set is_admin = true,
      pin_hash = excluded.pin_hash;

-- Any OTHER row migrated from customer_dates above still has no PIN
-- (pin_hash = '') and can't log in yet — the admin dashboard has a "Set
-- PIN" action for exactly this, so no further manual SQL is needed for
-- regular customers.
