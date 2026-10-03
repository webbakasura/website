import { NextRequest } from "next/server";
import { getSupabaseServer } from "./supabaseServer";
import { verifyPin } from "./pin";

const MAX_ATTEMPTS = 3;
const BASE_LOCKOUT_SECONDS = 300; // 5 minutes

export type Customer = {
  id: string;
  name: string;
  mobile: string;
  pin_hash: string;
  is_admin: boolean;
  dob: string | null;
  anniversary: string | null;
  notes: string | null;
  referred_by: string | null;
  points: number;
  referral_balance: number;
  lifetime_referral_earned: number;
  created_at: string;
};

type LockoutRow = {
  mobile: string;
  failed_attempts: number;
  locked_until: string | null;
  lockout_seconds: number;
};

export type AccountAccessResult =
  | { ok: true; customer: Customer }
  | { ok: false; status: 401; error: string }
  | { ok: false; status: 429; error: string; retryAfterSeconds: number };

function formatMinutes(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/**
 * Verifies the request's x-account-mobile / x-account-pin headers,
 * enforcing a per-mobile-number lockout (3 wrong PINs blocks that one
 * account for 5 minutes, doubling on each further lockout) backed by
 * Supabase so it holds across serverless invocations.
 */
export async function verifyAccountAccess(req: NextRequest): Promise<AccountAccessResult> {
  const mobile = normalizeMobile(req.headers.get("x-account-mobile") || "");
  const pin = req.headers.get("x-account-pin") || "";

  if (!mobile || !pin) {
    return { ok: false, status: 401, error: "Mobile number and PIN are required." };
  }

  const supabase = getSupabaseServer();

  const { data: lockRow } = await supabase
    .from("login_lockout")
    .select("mobile, failed_attempts, locked_until, lockout_seconds")
    .eq("mobile", mobile)
    .maybeSingle<LockoutRow>();

  const now = Date.now();
  if (lockRow?.locked_until && new Date(lockRow.locked_until).getTime() > now) {
    const retryAfterSeconds = Math.ceil((new Date(lockRow.locked_until).getTime() - now) / 1000);
    return {
      ok: false,
      status: 429,
      error: `Too many attempts. Try again in ${formatMinutes(retryAfterSeconds)}.`,
      retryAfterSeconds,
    };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("mobile", mobile)
    .maybeSingle<Customer>();

  const valid = !!customer?.pin_hash && (await verifyPin(pin, customer.pin_hash));

  if (valid && customer) {
    if (lockRow) {
      await supabase
        .from("login_lockout")
        .update({
          failed_attempts: 0,
          locked_until: null,
          lockout_seconds: BASE_LOCKOUT_SECONDS,
          updated_at: new Date().toISOString(),
        })
        .eq("mobile", mobile);
    }
    return { ok: true, customer };
  }

  const prevAttempts = lockRow?.failed_attempts ?? 0;
  const prevLockoutSeconds = lockRow?.lockout_seconds ?? BASE_LOCKOUT_SECONDS;
  const nextAttempts = prevAttempts + 1;

  if (nextAttempts >= MAX_ATTEMPTS) {
    const lockedUntil = new Date(now + prevLockoutSeconds * 1000).toISOString();
    const nextLockoutSeconds = Math.min(prevLockoutSeconds * 2, 60 * 60 * 24);

    await supabase.from("login_lockout").upsert({
      mobile,
      failed_attempts: 0,
      locked_until: lockedUntil,
      lockout_seconds: nextLockoutSeconds,
      updated_at: new Date().toISOString(),
    });

    return {
      ok: false,
      status: 429,
      error: `Too many attempts. Try again in ${formatMinutes(prevLockoutSeconds)}.`,
      retryAfterSeconds: prevLockoutSeconds,
    };
  }

  await supabase.from("login_lockout").upsert({
    mobile,
    failed_attempts: nextAttempts,
    locked_until: null,
    lockout_seconds: prevLockoutSeconds,
    updated_at: new Date().toISOString(),
  });

  const remaining = MAX_ATTEMPTS - nextAttempts;
  return {
    ok: false,
    status: 401,
    error: `Incorrect mobile number or PIN. ${remaining} attempt${remaining === 1 ? "" : "s"} left before lockout.`,
  };
}

export { normalizeMobile };
