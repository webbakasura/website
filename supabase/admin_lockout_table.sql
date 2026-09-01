-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- Tracks failed admin-passcode attempts for /admin/customers so it can be
-- locked out after repeated wrong guesses. Single shared row (id = 1)
-- since there's one shared admin passcode, not per-user accounts.

create table if not exists public.admin_lockout (
  id int primary key default 1,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  lockout_seconds int not null default 300,
  updated_at timestamptz not null default now(),
  constraint admin_lockout_single_row check (id = 1)
);

insert into public.admin_lockout (id) values (1)
  on conflict (id) do nothing;

-- Row Level Security is enabled with insert/select/update policies for the
-- anon key (used server-side only by /api/admin/* routes, never sent to
-- the browser). No delete policy — this row should never be removed.
alter table public.admin_lockout enable row level security;

drop policy if exists "Server can read lockout state" on public.admin_lockout;
create policy "Server can read lockout state"
  on public.admin_lockout
  for select
  to anon
  using (true);

drop policy if exists "Server can update lockout state" on public.admin_lockout;
create policy "Server can update lockout state"
  on public.admin_lockout
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Server can seed lockout state" on public.admin_lockout;
create policy "Server can seed lockout state"
  on public.admin_lockout
  for insert
  to anon
  with check (true);
