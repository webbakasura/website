-- Run this in the Supabase dashboard: SQL Editor > New query

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

-- Row Level Security is enabled with an INSERT-only policy for the anon
-- key (used server-side by our /api/subscribe route, never shipped to the
-- browser). There is no SELECT/UPDATE/DELETE policy, so nobody using the
-- anon key can read, edit, or delete existing rows — only add new ones.
alter table public.subscribers enable row level security;

drop policy if exists "Public can insert subscribers" on public.subscribers;
create policy "Public can insert subscribers"
  on public.subscribers
  for insert
  to anon
  with check (true);
