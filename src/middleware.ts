import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Các đường dẫn cho phép gọi phương thức ghi mà không cần cookie admin
const PUBLIC_WRITE_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  // Nếu form liên hệ ngoài trang chủ gửi POST tới /api/messages thì bỏ comment dòng dưới:
  // "/api/messages",
]);

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-secret-change-this-in-production";
}

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function verifyTokenEdge(token: string | undefined): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(getSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sigBytes = hexToBytes(signature);
    if (!sigBytes) return false;

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(payload),
    );
    if (!valid) return false;

    const jsonStr = decodeBase64Url(payload);
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.email || typeof parsed?.exp !== "number") return false;
    return Date.now() <= parsed.exp;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!WRITE_METHODS.has(req.method)) {
    return NextResponse.next();
  }

  if (PUBLIC_WRITE_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyTokenEdge(token);
  if (!ok) {
    return NextResponse.json(
      { error: "Bạn chưa đăng nhập phiên quản trị." },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
