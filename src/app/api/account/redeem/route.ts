import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess, normalizeMobile, Customer } from "@/lib/accountAuth";

const MIN_REDEMPTION = 100;

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
  const amount = Number(body.amount);
  const notes = typeof body.notes === "string" && body.notes ? body.notes.trim() : null;

  if (!customerMobile || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "A customer and redemption amount are required." }, { status: 400 });
  }

  const bareMobile = customerMobile.length === 12 && customerMobile.startsWith("91") ? customerMobile.slice(2) : customerMobile;
  const supabase = getSupabaseServer();

  const { data: customer } = await supabase
    .from("customers")
    .select("mobile, referral_balance")
    .or(`mobile.eq.${customerMobile},mobile.eq.${bareMobile}`)
    .maybeSingle<Pick<Customer, "mobile" | "referral_balance">>();

  if (!customer) {
    return NextResponse.json({ error: "No customer found with that mobile number." }, { status: 404 });
  }
  if (customer.referral_balance < MIN_REDEMPTION) {
    return NextResponse.json(
      { error: `Balance must be at least ₹${MIN_REDEMPTION} before it can be redeemed.` },
      { status: 400 }
    );
  }
  if (amount > customer.referral_balance) {
    return NextResponse.json({ error: "Redemption amount exceeds the current balance." }, { status: 400 });
  }

  const { error: redemptionError } = await supabase.from("redemptions").insert({
    customer_mobile: customer.mobile,
    amount,
    notes,
  });
  if (redemptionError) {
    return NextResponse.json({ error: "Could not record redemption." }, { status: 500 });
  }

  const newBalance = Math.round((customer.referral_balance - amount) * 100) / 100;
  const { error: updateError } = await supabase
    .from("customers")
    .update({ referral_balance: newBalance })
    .eq("mobile", customer.mobile);
  if (updateError) {
    return NextResponse.json({ error: "Redemption recorded, but balance could not be updated." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newBalance });
}
