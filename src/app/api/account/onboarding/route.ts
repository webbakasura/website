import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess } from "@/lib/accountAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function unauthorized(access: { status: 401 | 429; error: string; retryAfterSeconds?: number }) {
  return NextResponse.json(
    { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
    { status: access.status }
  );
}

export async function POST(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) return unauthorized(access);

  const body = await req.json();
  const action = typeof body.action === "string" ? body.action : "";
  const supabase = getSupabaseServer();
  const customer = access.customer;

  if (action === "email") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { error: subError } = await supabase.from("subscribers").insert({ email });
    if (subError && subError.code !== "23505") {
      return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
    }

    const { error } = await supabase
      .from("customers")
      .update({ email, email_subscribed: true })
      .eq("id", customer.id);
    if (error) return NextResponse.json({ error: "Could not save your email." }, { status: 500 });
  } else if (action === "whatsapp") {
    const { error } = await supabase
      .from("customers")
      .update({ whatsapp_followed: true })
      .eq("id", customer.id);
    if (error) return NextResponse.json({ error: "Could not update." }, { status: 500 });
  } else if (action === "feedback") {
    // The actual feedback text is submitted straight to /api/feedback by the
    // real feedback form — this just records that this customer has done it.
    const { error } = await supabase
      .from("customers")
      .update({ feedback_given: true })
      .eq("id", customer.id);
    if (error) return NextResponse.json({ error: "Could not update." }, { status: 500 });
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const { data: updated } = await supabase
    .from("customers")
    .select("email_subscribed, whatsapp_followed, feedback_given, rewards_unlocked")
    .eq("id", customer.id)
    .single();

  if (updated && !updated.rewards_unlocked && updated.email_subscribed && updated.feedback_given) {
    await supabase.from("customers").update({ rewards_unlocked: true }).eq("id", customer.id);
    updated.rewards_unlocked = true;
  }

  return NextResponse.json({ ok: true, ...updated });
}
