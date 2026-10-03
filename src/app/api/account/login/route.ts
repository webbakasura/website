import { NextRequest, NextResponse } from "next/server";
import { verifyAccountAccess } from "@/lib/accountAuth";

export async function POST(req: NextRequest) {
  const access = await verifyAccountAccess(req);

  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, ...(access.status === 429 ? { retryAfterSeconds: access.retryAfterSeconds } : {}) },
      { status: access.status }
    );
  }

  const { pin_hash, ...safeCustomer } = access.customer;
  return NextResponse.json({ customer: safeCustomer });
}
