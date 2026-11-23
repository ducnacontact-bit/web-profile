import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import {
  ADMIN_COOKIE_NAME,
  signSessionToken,
  verifyPassword,
} from "../../../../lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const dbUser = await db.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (dbUser) {
      if (!dbUser.isActive) {
        return NextResponse.json(
          { error: "Tài khoản admin đang bị khóa." },
          { status: 403 },
        );
      }
      if (!verifyPassword(password, dbUser.passwordHash)) {
        return NextResponse.json(
          { error: "Email hoặc mật khẩu không chính xác." },
          { status: 401 },
        );
      }

      await db.adminUser.update({
        where: { id: dbUser.id },
        data: { lastLoginAt: new Date() },
      });

      const token = signSessionToken(dbUser.email);
      const res = NextResponse.json({
        ok: true,
        user: { id: dbUser.id, email: dbUser.email, name: dbUser.name },
      });
      res.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    const totalUsers = await db.adminUser.count();
    const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || "";

    if (
      totalUsers === 0 &&
      envEmail &&
      envPassword &&
      normalizedEmail === envEmail &&
      password === envPassword
    ) {
      const token = signSessionToken(envEmail);
      const res = NextResponse.json({
        ok: true,
        user: { email: envEmail, name: "Super Admin (ENV)" },
      });
      res.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    return NextResponse.json(
      { error: "Email hoặc mật khẩu không chính xác." },
      { status: 401 },
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Lỗi đăng nhập." }, { status: 500 });
  }
}
