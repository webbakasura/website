import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

const RATING_OPTIONS = ["Poor", "Fair", "Good", "Excellent", "N/A"] as const;
type RatingValue = (typeof RATING_OPTIONS)[number];

function isValidRating(v: unknown): v is RatingValue {
  return typeof v === "string" && (RATING_OPTIONS as readonly string[]).includes(v);
}

const RATING_FIELDS = [
  { key: "qualityRating", column: "quality_rating" },
  { key: "quantityRating", column: "quantity_rating" },
  { key: "tasteRating", column: "taste_rating" },
  { key: "temperatureRating", column: "temperature_rating" },
  { key: "speedRating", column: "speed_rating" },
  { key: "overallRating", column: "overall_rating" },
] as const;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const { name, contact, message, website } = data;

  // Honeypot: real users never fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (contact !== undefined && contact !== null) {
    if (typeof contact !== "string" || contact.length > 150) {
      return NextResponse.json({ error: "Invalid contact value." }, { status: 400 });
    }
  }
  if (message !== undefined && message !== null) {
    if (typeof message !== "string" || message.length > 2000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }
  }

  const insertRow: Record<string, unknown> = {
    name: name.trim(),
    contact: typeof contact === "string" ? contact.trim() || null : null,
    message: typeof message === "string" ? message.trim() || null : null,
  };

  for (const field of RATING_FIELDS) {
    const value = data[field.key];
    if (!isValidRating(value)) {
      return NextResponse.json({ error: "Please rate all categories." }, { status: 400 });
    }
    insertRow[field.column] = value;
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("feedback").insert(insertRow);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback route error:", err);
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }
}
