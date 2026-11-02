-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- The public newsletter signup now collects a mobile number instead of an
-- email address. Existing email-based subscriber rows are kept as-is;
-- `email` just stops being required for new signups.

alter table public.subscribers
  alter column email drop not null,
  add column if not exists mobile text unique;
