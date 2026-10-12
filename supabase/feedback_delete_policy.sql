-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- The feedback table originally only allowed anon INSERT (see
-- feedback_table.sql), so moderation (admin deleting a submission) silently
-- affected 0 rows. Admin-only access is enforced in the API route itself
-- (/api/feedback DELETE checks is_admin before ever reaching Supabase) —
-- this just lets the server's anon key perform the delete at all, same
-- trust model already used for customers/purchases/redemptions.

drop policy if exists "Server can delete feedback" on public.feedback;
create policy "Server can delete feedback"
  on public.feedback
  for delete
  to anon
  using (true);
