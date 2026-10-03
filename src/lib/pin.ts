import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

/** Hashes a PIN as "salt:hash" (hex), using scrypt — no extra dependency needed. */
export async function hashPin(pin: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(pin, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/** Verifies a PIN against a "salt:hash" string produced by hashPin(). */
export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const derived = (await scryptAsync(pin, salt, 64)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
