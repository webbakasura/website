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

  if (!customerMobile || !Number.isFinite(biryaniCount) || biryaniCount <= 0 || !Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ error: "A customer, biryani count, and amount are required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("mobile", customerMobile)
    .maybeSingle<Customer>();

  if (!customer) {
    return NextResponse.json({ error: "No customer found with that mobile number." }, { status: 404 });
  }

  const pointsAwarded = Math.round(biryaniCount * POINTS_PER_BIRYANI);
  const referrerMobile = customer.referred_by;
  const referralBonus = referrerMobile ? Math.round(amount * REFERRAL_RATE * 100) / 100 : 0;

  const { error: purchaseError } = await supabase.from("purchases").insert({
    customer_mobile: customerMobile,
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
    .eq("mobile", customerMobile);
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
