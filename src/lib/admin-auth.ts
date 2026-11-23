import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "dev-secret-change-this-in-production";
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, keyHex] = storedHash.split(":");
  const keyBuffer = Buffer.from(keyHex, "hex");
  const derivedBuffer = crypto.scryptSync(password, salt, 64);
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

export function signSessionToken(
  email: string,
  maxAgeMs = 1000 * 60 * 60 * 24 * 7,
): string {
  const exp = Date.now() + maxAgeMs;
  const payload = Buffer.from(
    JSON.stringify({ email: email.toLowerCase(), exp }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined,
): { email: string; exp: number } | null {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("hex");

  if (signature.length !== expectedSig.length) return null;
  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (!parsed?.email || typeof parsed?.exp !== "number") return null;
    if (Date.now() > parsed.exp) return null;
    return { email: String(parsed.email).toLowerCase(), exp: parsed.exp };
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdminEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const verified = verifySessionToken(token);
  return verified?.email || null;
}
