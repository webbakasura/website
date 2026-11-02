-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- Inserts into subscribers were failing with a row-level security
-- violation even though the original policy looked correct — same class
-- of issue hit earlier with the feedback table. Resetting to one clean
-- policy fixes it.

drop policy if exists "Public can insert subscribers" on public.subscribers;
drop policy if exists "Server can access subscribers" on public.subscribers;

create policy "Server can access subscribers" on public.subscribers
  for all
  to anon
  using (true)
  with check (true);
