import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

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
 * Returns only approved reviews.
 * Contact information and individual category ratings
 * are intentionally not exposed publicly.
 */
export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
        .from("feedback")
        .select("id, name, message, overall_rating, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

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