import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess, normalizeMobile, Customer } from "@/lib/accountAuth";

const POINTS_PER_BIRYANI = 3;
const REFERRAL_RATE = 0.1;

function unauthorized(access: { status: 401 | 429; error: string; retryAfterSeconds?: number }) {
  return NextResponse.json(
    { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
    { status: access.status }
  );
}

export async function POST(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);
  if (!access.customer.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  const customerMobile = normalizeMobile(typeof body.customerMobile === "string" ? body.customerMobile : "");
  const biryaniCount = Number(body.biryaniCount);
  const amount = Number(body.amount);
  const referredByRaw = typeof body.referredBy === "string" ? body.referredBy.trim() : "";
  const referredByInput = referredByRaw ? normalizeMobile(referredByRaw) : "";

  if (!customerMobile || !Number.isFinite(biryaniCount) || biryaniCount <= 0 || !Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ error: "A customer, biryani count, and amount are required." }, { status: 400 });
  }
  if (referredByInput && referredByInput === customerMobile) {
    return NextResponse.json({ error: "A customer cannot refer themselves." }, { status: 400 });
  }

  // Match on the normalized mobile OR its bare 10-digit form, so a row left
  // over from before numbers were normalized still resolves. Once found,
  // the record's own `mobile` value (not the input) is used everywhere
  // below, since that's the exact value other rows actually reference.
  const bareMobile = customerMobile.length === 12 && customerMobile.startsWith("91") ? customerMobile.slice(2) : customerMobile;
  const supabase = getSupabaseServer();

  let { data: customer } = await supabase
    .from("customers")
    .select("*")
    .or(`mobile.eq.${customerMobile},mobile.eq.${bareMobile}`)
    .maybeSingle<Customer>();

  if (!customer) {
    // Same as the referrer below: a walk-in customer who's never ordered
    // before shouldn't have to be added separately first. They're created
    // with their mobile as a placeholder name — rename via Edit later.
    const { data: newCustomer, error: newCustomerError } = await supabase
      .from("customers")
      .insert({ name: customerMobile, mobile: customerMobile, pin_hash: "" })
      .select("*")
      .single<Customer>();
    if (newCustomerError || !newCustomer) {
      return NextResponse.json({ error: "Could not add this customer." }, { status: 500 });
    }
    customer = newCustomer;
  }

  // A referrer entered on the purchase form takes priority over whatever is
  // already on file for this customer — it both decides this purchase's
  // bonus and updates `referred_by` so future purchases keep crediting them
  // too. Leaving the field blank falls back to the existing referred_by.
  let referrerMobile = customer.referred_by;
  if (referredByInput) {
    const referrerBareMobile = referredByInput.length === 12 && referredByInput.startsWith("91") ? referredByInput.slice(2) : referredByInput;
    const { data: existingReferrer } = await supabase
      .from("customers")
      .select("mobile")
      .or(`mobile.eq.${referredByInput},mobile.eq.${referrerBareMobile}`)
      .maybeSingle<Pick<Customer, "mobile">>();

    if (existingReferrer) {
      referrerMobile = existingReferrer.mobile;
    } else {
      const { data: newReferrer, error: newReferrerError } = await supabase
        .from("customers")
        .insert({ name: referredByInput, mobile: referredByInput, pin_hash: "" })
        .select("mobile")
        .single<Pick<Customer, "mobile">>();
      if (newReferrerError || !newReferrer) {
        return NextResponse.json({ error: "Could not add the referrer." }, { status: 500 });
      }
      referrerMobile = newReferrer.mobile;
    }

    if (referrerMobile !== customer.referred_by) {
      await supabase.from("customers").update({ referred_by: referrerMobile }).eq("id", customer.id);
    }
  }

  const pointsAwarded = Math.round(biryaniCount * POINTS_PER_BIRYANI);
  const referralBonus = referrerMobile ? Math.round(amount * REFERRAL_RATE * 100) / 100 : 0;

  const { error: purchaseError } = await supabase.from("purchases").insert({
    customer_mobile: customer.mobile,
    biryani_count: biryaniCount,
    amount,
    referrer_mobile: referrerMobile,
    points_awarded: pointsAwarded,
    referral_bonus: referralBonus,
  });
  if (purchaseError) {
    return NextResponse.json({ error: "Could not record purchase." }, { status: 500 });
  }

  const { error: pointsError } = await supabase
    .from("customers")
    .update({ points: customer.points + pointsAwarded })
    .eq("id", customer.id);
  if (pointsError) {
    return NextResponse.json({ error: "Purchase recorded, but points could not be updated." }, { status: 500 });
  }

  if (referrerMobile && referralBonus > 0) {
    const { data: referrer } = await supabase
      .from("customers")
      .select("referral_balance, lifetime_referral_earned")
      .eq("mobile", referrerMobile)
      .maybeSingle<Pick<Customer, "referral_balance" | "lifetime_referral_earned">>();

    if (referrer) {
      await supabase
        .from("customers")
        .update({
          referral_balance: Math.round((referrer.referral_balance + referralBonus) * 100) / 100,
          lifetime_referral_earned: Math.round((referrer.lifetime_referral_earned + referralBonus) * 100) / 100,
        })
        .eq("mobile", referrerMobile);
    }
  }

  return NextResponse.json({ ok: true, pointsAwarded, referralBonus });
}
