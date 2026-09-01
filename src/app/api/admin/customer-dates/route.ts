import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAdminAccess } from "@/lib/adminAuth";

const MOBILE_RE = /^[0-9+()\-\s]{7,20}$/;

export async function GET(req: NextRequest) {
  const access = await verifyAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
      { status: access.status }
    );
  }

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("customer_dates")
      .select("id, name, mobile, dob, anniversary, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error.message);
      return NextResponse.json({ error: "Could not load entries." }, { status: 500 });
    }

    return NextResponse.json({ entries: data ?? [] });
  } catch (err) {
    console.error("Customer-dates GET error:", err);
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const access = await verifyAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
      { status: access.status }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, mobile, dob, anniversary, notes } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (typeof mobile !== "string" || !MOBILE_RE.test(mobile.trim())) {
    return NextResponse.json({ error: "Please enter a valid mobile number." }, { status: 400 });
  }
  if (dob !== undefined && dob !== null && dob !== "" && typeof dob !== "string") {
    return NextResponse.json({ error: "Invalid date of birth." }, { status: 400 });
  }
  if (
    anniversary !== undefined &&
    anniversary !== null &&
    anniversary !== "" &&
    typeof anniversary !== "string"
  ) {
    return NextResponse.json({ error: "Invalid anniversary date." }, { status: 400 });
  }
  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    return NextResponse.json({ error: "Invalid notes." }, { status: 400 });
  }
  if (!dob && !anniversary) {
    return NextResponse.json(
      { error: "Enter at least a birthday or an anniversary date." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("customer_dates").insert({
      name: name.trim(),
      mobile: mobile.trim(),
      dob: dob || null,
      anniversary: anniversary || null,
      notes: typeof notes === "string" ? notes.trim() || null : null,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Could not save entry." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Customer-dates POST error:", err);
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const access = await verifyAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
      { status: access.status }
    );
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("customer_dates").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error.message);
      return NextResponse.json({ error: "Could not delete entry." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Customer-dates DELETE error:", err);
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }
}
