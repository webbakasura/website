import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess, normalizeMobile } from "@/lib/accountAuth";
import { hashPin } from "@/lib/pin";

function unauthorized(access: { status: 401 | 429; error: string; retryAfterSeconds?: number }) {
  return NextResponse.json(
    { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
    { status: access.status }
  );
}

export async function GET(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);
  if (!access.customer.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, mobile, is_admin, dob, anniversary, notes, referred_by, points, referral_balance, lifetime_referral_earned, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load customers." }, { status: 500 });
  }

  return NextResponse.json({ customers: data });
}

export async function POST(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);
  if (!access.customer.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const mobileRaw = typeof body.mobile === "string" ? body.mobile.trim() : "";
  const mobile = normalizeMobile(mobileRaw);
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  const dob = typeof body.dob === "string" && body.dob ? body.dob : null;
  const anniversary = typeof body.anniversary === "string" && body.anniversary ? body.anniversary : null;
  const notes = typeof body.notes === "string" && body.notes ? body.notes.trim() : null;
  const referredByRaw = typeof body.referredBy === "string" ? body.referredBy.trim() : "";
  const referredBy = referredByRaw ? normalizeMobile(referredByRaw) : null;

  if (!name || !/^\d{10,12}$/.test(mobile)) {
    return NextResponse.json({ error: "A name and valid mobile number are required." }, { status: 400 });
  }
  if (!dob && !anniversary) {
    return NextResponse.json({ error: "At least a date of birth or anniversary is required." }, { status: 400 });
  }
  if (referredBy && referredBy === mobile) {
    return NextResponse.json({ error: "A customer cannot refer themselves." }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const record: Record<string, unknown> = {
    name,
    mobile,
    dob,
    anniversary,
    notes,
    referred_by: referredBy,
  };

  if (pin) {
    if (!/^\d{4,8}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be 4-8 digits." }, { status: 400 });
    }
    record.pin_hash = await hashPin(pin);
  }

  const { data: existing } = await supabase
    .from("customers")
    .select("id, pin_hash")
    .eq("mobile", mobile)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("customers").update(record).eq("mobile", mobile);
    if (error) return NextResponse.json({ error: "Could not update customer." }, { status: 500 });
  } else {
    if (!pin) {
      record.pin_hash = "";
    }
    const { error } = await supabase.from("customers").insert(record);
    if (error) return NextResponse.json({ error: "Could not save customer." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);
  if (!access.customer.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const mobile = normalizeMobile(searchParams.get("mobile") || "");
  if (!mobile) {
    return NextResponse.json({ error: "Mobile number is required." }, { status: 400 });
  }
  if (mobile === access.customer.mobile) {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from("customers").delete().eq("mobile", mobile);
  if (error) return NextResponse.json({ error: "Could not delete customer." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
