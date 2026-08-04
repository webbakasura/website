-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- If you already ran an earlier version of this script, drop the old
-- table first: drop table public.feedback;
-- (only safe if it has no rows you care about keeping)

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text,
  message text,
  quality_rating text not null check (quality_rating in ('Poor','Fair','Good','Excellent','N/A')),
  quantity_rating text not null check (quantity_rating in ('Poor','Fair','Good','Excellent','N/A')),
  taste_rating text not null check (taste_rating in ('Poor','Fair','Good','Excellent','N/A')),
  temperature_rating text not null check (temperature_rating in ('Poor','Fair','Good','Excellent','N/A')),
  speed_rating text not null check (speed_rating in ('Poor','Fair','Good','Excellent','N/A')),
  overall_rating text not null check (overall_rating in ('Poor','Fair','Good','Excellent','N/A'))
);

-- Row Level Security is enabled with an INSERT-only policy for the anon
-- key (used server-side by our /api/feedback route, never shipped to the
-- browser). There is no SELECT/UPDATE/DELETE policy, so nobody using the
-- anon key can read, edit, or delete existing rows — only add new ones.
alter table public.feedback enable row level security;

drop policy if exists "Public can insert feedback" on public.feedback;
create policy "Public can insert feedback"
  on public.feedback
  for insert
  to anon
  with check (true);
