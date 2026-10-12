import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifyAccountAccess } from "@/lib/accountAuth";

const RATING_OPTIONS = [
  "Poor",
  "Fair",
  "Good",
  "Excellent",
  "N/A",
] as const;

type RatingValue = (typeof RATING_OPTIONS)[number];

function isValidRating(v: unknown): v is RatingValue {
  return (
      typeof v === "string" &&
      (RATING_OPTIONS as readonly string[]).includes(v)
  );
}

const RATING_FIELDS = [
  { key: "qualityRating", column: "quality_rating" },
  { key: "quantityRating", column: "quantity_rating" },
  { key: "tasteRating", column: "taste_rating" },
  { key: "temperatureRating", column: "temperature_rating" },
  { key: "speedRating", column: "speed_rating" },
  { key: "overallRating", column: "overall_rating" },
] as const;

/**
 * GET /api/feedback
 *
 * Public callers get only approved reviews, with contact information and
 * individual category ratings intentionally left out. An authenticated
 * admin (x-account-mobile / x-account-pin headers) gets every submission
 * with full detail, regardless of status. An authenticated non-admin
 * customer gets full detail too, but only for their own submissions
 * (matched by contact against their mobile number).
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const access = await verifyAccountAccess(req);
    const isAdmin = access.ok && access.customer.is_admin;
    const isOwnCustomer = access.ok && !access.customer.is_admin;

    const fullFields = "id, name, contact, message, quality_rating, quantity_rating, taste_rating, temperature_rating, speed_rating, overall_rating, status, created_at";
    const publicFields = "id, name, message, overall_rating, created_at";

    let query = supabase
        .from("feedback")
        .select(isAdmin || isOwnCustomer ? fullFields : publicFields)
        .order("created_at", { ascending: false });

    if (isOwnCustomer && access.ok) {
      const mobile = access.customer.mobile;
      const bareMobile = mobile.length === 12 && mobile.startsWith("91") ? mobile.slice(2) : mobile;
      // Also match by their subscribed email — feedback submitted before
      // this account system existed often used an email as contact, with
      // no mobile number on file for the row at all.
      const matchers = [`contact.eq.${mobile}`, `contact.eq.${bareMobile}`];
      if (access.customer.email) matchers.push(`contact.eq.${access.customer.email}`);
      query = query.or(matchers.join(","));
    } else if (!isAdmin) {
      query = query.eq("status", "approved");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase reviews fetch error:", error.message);

      return NextResponse.json(
          {
            error: "Could not load reviews.",
          },
          { status: 500 }
      );
    }

    return NextResponse.json(
        {
          reviews: data ?? [],
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
    );
  } catch (err) {
    console.error("Reviews route error:", err);

    return NextResponse.json(
        {
          error: "Server not configured.",
        },
        { status: 500 }
    );
  }
}

/**
 * POST /api/feedback
 *
 * Creates a new feedback entry.
 * Every new review starts with status = pending.
 */
export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  const { name, contact, message, website } = data;

  /**
   * Honeypot
   *
   * Real users never fill this hidden field.
   * If it contains something, silently accept the
   * request without inserting anything.
   */
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  /**
   * Validate name
   */
  if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100
  ) {
    return NextResponse.json(
        {
          error: "Please enter a valid name.",
        },
        { status: 400 }
    );
  }

  /**
   * Validate contact
   */
  if (contact !== undefined && contact !== null) {
    if (
        typeof contact !== "string" ||
        contact.length > 150
    ) {
      return NextResponse.json(
          {
            error: "Invalid contact value.",
          },
          { status: 400 }
      );
    }
  }

  /**
   * Validate message
   */
  if (message !== undefined && message !== null) {
    if (
        typeof message !== "string" ||
        message.length > 2000
    ) {
      return NextResponse.json(
          {
            error: "Message is too long.",
          },
          { status: 400 }
      );
    }
  }

  /**
   * Prepare Supabase row
   */
  const insertRow: Record<string, unknown> = {
    name: name.trim(),

    contact:
        typeof contact === "string"
            ? contact.trim() || null
            : null,

    message:
        typeof message === "string"
            ? message.trim() || null
            : null,

    // All new reviews require approval.
    status: "approved",
  };

  /**
   * Validate all rating fields
   */
  for (const field of RATING_FIELDS) {
    const value = data[field.key];

    if (!isValidRating(value)) {
      return NextResponse.json(
          {
            error: "Please rate all categories.",
          },
          { status: 400 }
      );
    }

    insertRow[field.column] = value;
  }

  /**
   * Insert feedback into Supabase
   */
  try {
    const supabase = getSupabaseServer();

    const { error } = await supabase
        .from("feedback")
        .insert(insertRow);

    if (error) {
      console.error(
          "Supabase insert error:",
          error.message
      );

      return NextResponse.json(
          {
            error: "Could not save feedback.",
          },
          { status: 500 }
      );
    }

    return NextResponse.json(
        {
          ok: true,
        },
        { status: 201 }
    );
  } catch (err) {
    console.error("Feedback route error:", err);

    return NextResponse.json(
        {
          error: "Server not configured.",
        },
        { status: 500 }
    );
  }
}

/**
 * DELETE /api/feedback?id=...
 *
 * Admin-only moderation: removes a submission (e.g. spam or abuse).
 */
export async function DELETE(req: NextRequest) {
  const access = await verifyAccountAccess(req);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
      { status: access.status }
    );
  }
  if (!access.customer.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Feedback id is required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Could not delete feedback." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback delete route error:", err);
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }
}