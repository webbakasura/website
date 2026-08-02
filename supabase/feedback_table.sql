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

-- Row Level Security is enabled with NO policies, so the public/anon key
-- gets zero access (no read, no write). Only the service_role key used by
-- our /api/feedback route (server-side only) can read or write this table.
alter table public.feedback enable row level security;
