-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- Resets feedback table permissions to one simple, known-good policy,
-- replacing whatever individual insert/select/delete policies exist now
-- (some combination of which started blocking even public submissions).
-- Matches the same trust model already used for customers/purchases/etc:
-- the anon key is used server-side only, and the app itself enforces who
-- can call each action (public can submit feedback; only admins can view
-- full detail or delete, both checked in the API route before Supabase is
-- ever touched).

alter table public.feedback enable row level security;

drop policy if exists "Public can insert feedback" on public.feedback;
drop policy if exists "Server can delete feedback" on public.feedback;
drop policy if exists "Server can read feedback" on public.feedback;
drop policy if exists "Server can access feedback" on public.feedback;

create policy "Server can access feedback" on public.feedback
  for all
  to anon
  using (true)
  with check (true);
