import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess, normalizeMobile, Customer } from "@/lib/accountAuth";

const COUPON_AMOUNT = 1000;
const VALID_DAYS = 30;

function unauthorized(access: { status: 401 | 429; error: string; retryAfterSeconds?: number }) {
  return NextResponse.json(
    { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
    { status: access.status }
  );
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) code += chars[bytes[i] % chars.length];
  return `BAKA-${code}`;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

async function requireAdmin(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return { error: unauthorized(access) };
  if (!access.customer.is_admin) {
    return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  }
  return { access };
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const supabase = getSupabaseServer();
  const { data, error: dbError } = await supabase
    .from("lucky_coupons")
    .select("id, created_at, customer_mobile, code, amount, month, expires_at, redeemed, redeemed_at")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: "Could not load coupons." }, { status: 500 });
  }
  return NextResponse.json({ coupons: data });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const customerMobile = normalizeMobile(typeof body.customerMobile === "string" ? body.customerMobile : "");
  if (!customerMobile) {
    return NextResponse.json({ error: "A customer is required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const bareMobile = customerMobile.length === 12 && customerMobile.startsWith("91") ? customerMobile.slice(2) : customerMobile;
  const { data: customer } = await supabase
    .from("customers")
    .select("mobile")
    .or(`mobile.eq.${customerMobile},mobile.eq.${bareMobile}`)
    .maybeSingle<Pick<Customer, "mobile">>();

  if (!customer) {
    return NextResponse.json({ error: "No customer found with that mobile number." }, { status: 404 });
  }

  const expiresAt = new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const month = currentMonth();

  // Extremely unlikely to collide, but retry once on a unique-constraint hit.
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateCode();
    const { data, error: insertError } = await supabase
      .from("lucky_coupons")
      .insert({ customer_mobile: customer.mobile, code, amount: COUPON_AMOUNT, month, expires_at: expiresAt })
      .select("id, created_at, customer_mobile, code, amount, month, expires_at, redeemed, redeemed_at")
      .single();

    if (!insertError) return NextResponse.json({ ok: true, coupon: data });
    if (insertError.code !== "23505") {
      return NextResponse.json({ error: "Could not create coupon." }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Could not generate a unique code, please try again." }, { status: 500 });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Coupon id is required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error: dbError } = await supabase
    .from("lucky_coupons")
    .update({ redeemed: true, redeemed_at: new Date().toISOString() })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: "Could not mark coupon as redeemed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Coupon id is required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error: dbError } = await supabase.from("lucky_coupons").delete().eq("id", id);
  if (dbError) {
    return NextResponse.json({ error: "Could not delete coupon." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
