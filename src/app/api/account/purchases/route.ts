import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess, normalizeMobile, Customer } from "@/lib/accountAuth";

function unauthorized(access: { status: 401 | 429; error: string; retryAfterSeconds?: number }) {
  return NextResponse.json(
    { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
    { status: access.status }
  );
}

export async function GET(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);

  const supabase = getSupabaseServer();
  let query = supabase
    .from("purchases")
    .select("id, created_at, customer_mobile, biryani_count, amount, referrer_mobile, points_awarded, referral_bonus")
    .order("created_at", { ascending: false })
    .limit(200);

  if (access.customer.is_admin) {
    const filterMobile = req.nextUrl.searchParams.get("mobile");
    if (filterMobile) {
      query = query.eq("customer_mobile", normalizeMobile(filterMobile));
    }
  } else {
    // Non-admins can only ever see their own purchase history, regardless
    // of what's requested — the mobile used to authenticate is the only
    // one trusted here.
    query = query.eq("customer_mobile", access.customer.mobile);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Could not load purchases." }, { status: 500 });
  }

  return NextResponse.json({ purchases: data });
}

export async function DELETE(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);
  if (!access.customer.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Purchase id is required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, customer_mobile, referrer_mobile, points_awarded, referral_bonus")
    .eq("id", id)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }

  // Deleting a purchase un-does what it granted, so a mistaken entry
  // doesn't leave the customer's points or the referrer's balance
  // permanently overstated.
  const { data: buyer } = await supabase
    .from("customers")
    .select("id, points")
    .eq("mobile", purchase.customer_mobile)
    .maybeSingle<Pick<Customer, "id" | "points">>();

  if (buyer) {
    await supabase
      .from("customers")
      .update({ points: Math.max(0, buyer.points - purchase.points_awarded) })
      .eq("id", buyer.id);
  }

  if (purchase.referrer_mobile && purchase.referral_bonus > 0) {
    const { data: referrer } = await supabase
      .from("customers")
      .select("id, referral_balance, lifetime_referral_earned")
      .eq("mobile", purchase.referrer_mobile)
      .maybeSingle<Pick<Customer, "id" | "referral_balance" | "lifetime_referral_earned">>();

    if (referrer) {
      await supabase
        .from("customers")
        .update({
          referral_balance: Math.max(0, Math.round((referrer.referral_balance - purchase.referral_bonus) * 100) / 100),
          lifetime_referral_earned: Math.max(0, Math.round((referrer.lifetime_referral_earned - purchase.referral_bonus) * 100) / 100),
        })
        .eq("id", referrer.id);
    }
  }

  const { error: deleteError } = await supabase.from("purchases").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: "Could not delete purchase." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
