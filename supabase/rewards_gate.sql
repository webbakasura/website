-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- One-time onboarding gate: a customer only starts earning +3 points per
-- biryani and 10% referral bonuses once they've (1) subscribed by email and
-- (3) given feedback. Following the WhatsApp channel (2) is tracked too but
-- does NOT block earning, per the explicit requirement that only 1 and 3
-- are mandatory. Once `rewards_unlocked` flips to true it stays true —
-- this is a one-time check, not something re-verified on every purchase.

alter table public.customers
  add column if not exists email text,
  add column if not exists email_subscribed boolean not null default false,
  add column if not exists whatsapp_followed boolean not null default false,
  add column if not exists feedback_given boolean not null default false,
  add column if not exists rewards_unlocked boolean not null default false;
