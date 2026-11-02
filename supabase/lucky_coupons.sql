-- Run this in the Supabase dashboard: SQL Editor > New query
--
-- Monthly Lucky Coupon: admin manually picks 3 winners a month (no random
-- draw — a discretionary reward, not a chance-based prize competition, to
-- stay clear of gambling-law framing). Each winner gets a unique code worth
-- ₹1000, valid for one month, takeaway only, not usable on Swiggy/Zomato —
-- those terms are enforced by staff at redemption and stated in the
-- WhatsApp message sent to the winner, not by this schema.
--
-- order_source on purchases tracks how each sale came in, so "only through
-- website orders" claims can eventually be checked against real data —
-- orders have historically all come in over WhatsApp/phone (there's no
-- online checkout), so existing rows default to 'whatsapp'.

alter table public.purchases
  add column if not exists order_source text not null default 'whatsapp'
    check (order_source in ('website', 'whatsapp', 'walkin'));

create table if not exists public.lucky_coupons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_mobile text not null references public.customers(mobile) on delete cascade,
  code text not null unique,
  amount numeric(10, 2) not null default 1000,
  month text not null,
  expires_at timestamptz not null,
  redeemed boolean not null default false,
  redeemed_at timestamptz
);

create index if not exists lucky_coupons_customer_idx on public.lucky_coupons (customer_mobile);
create index if not exists lucky_coupons_month_idx on public.lucky_coupons (month);

alter table public.lucky_coupons enable row level security;

drop policy if exists "Server can access lucky_coupons" on public.lucky_coupons;
create policy "Server can access lucky_coupons" on public.lucky_coupons
  for all to anon using (true) with check (true);
