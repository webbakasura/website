import { NextRequest } from "next/server";
import { getSupabaseServer } from "./supabaseServer";

const MAX_ATTEMPTS = 3;
const BASE_LOCKOUT_SECONDS = 300; // 5 minutes

type LockoutRow = {
  failed_attempts: number;
  locked_until: string | null;
  lockout_seconds: number;
};

export type AdminAccessResult =
  | { ok: true }
  | { ok: false; status: 401; error: string }
  | { ok: false; status: 429; error: string; retryAfterSeconds: number };

function formatMinutes(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

/**
 * Checks the request's passcode header against ADMIN_PASSCODE, enforcing
 * a shared lockout: 3 wrong attempts blocks access for 5 minutes; each
 * time a fresh set of 3 wrong attempts happens after a lockout expires,
 * the next lockout duration doubles. State lives in Supabase (single row)
 * so it holds even across serverless invocations.
 */
export async function verifyAdminAccess(req: NextRequest): Promise<AdminAccessResult> {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) {
    return { ok: false, status: 401, error: "Admin passcode is not configured." };
  }

  const provided = req.headers.get("x-admin-passcode") || "";
  const supabase = getSupabaseServer();

  const { data: row, error: readError } = await supabase
    .from("admin_lockout")
    .select("failed_attempts, locked_until, lockout_seconds")
    .eq("id", 1)
    .maybeSingle<LockoutRow>();

  // If the lockout table isn't set up yet, fall back to a plain passcode
  // check rather than hard-failing the whole admin tool.
  if (readError || !row) {
    return provided === expected
      ? { ok: true }
      : { ok: false, status: 401, error: "Incorrect passcode." };
  }

  const now = Date.now();
  if (row.locked_until && new Date(row.locked_until).getTime() > now) {
    const retryAfterSeconds = Math.ceil((new Date(row.locked_until).getTime() - now) / 1000);
    return {
      ok: false,
      status: 429,
      error: `Too many attempts. Try again in ${formatMinutes(retryAfterSeconds)}.`,
      retryAfterSeconds,
    };
  }

  if (provided === expected) {
    await supabase
      .from("admin_lockout")
      .update({
        failed_attempts: 0,
        locked_until: null,
        lockout_seconds: BASE_LOCKOUT_SECONDS,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    return { ok: true };
  }

  const nextAttempts = row.failed_attempts + 1;

  if (nextAttempts >= MAX_ATTEMPTS) {
    const lockoutSeconds = row.lockout_seconds || BASE_LOCKOUT_SECONDS;
    const lockedUntil = new Date(now + lockoutSeconds * 1000).toISOString();
    const nextLockoutSeconds = Math.min(lockoutSeconds * 2, 60 * 60 * 24); // cap at 24h

    await supabase
      .from("admin_lockout")
      .update({
        failed_attempts: 0,
        locked_until: lockedUntil,
        lockout_seconds: nextLockoutSeconds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    return {
      ok: false,
      status: 429,
      error: `Too many attempts. Try again in ${formatMinutes(lockoutSeconds)}.`,
      retryAfterSeconds: lockoutSeconds,
    };
  }

  await supabase
    .from("admin_lockout")
    .update({ failed_attempts: nextAttempts, updated_at: new Date().toISOString() })
    .eq("id", 1);

  const remaining = MAX_ATTEMPTS - nextAttempts;
  return {
    ok: false,
    status: 401,
    error: `Incorrect passcode. ${remaining} attempt${remaining === 1 ? "" : "s"} left before lockout.`,
  };
}
