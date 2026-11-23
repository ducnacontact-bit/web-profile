import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getAuthenticatedAdminEmail } from "../../../../lib/admin-auth";

export async function GET() {
  const email = await getAuthenticatedAdminEmail();
  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const dbUser = await db.adminUser.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, isActive: true },
  });

  if (dbUser) {
    if (!dbUser.isActive) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: { id: dbUser.id, email: dbUser.email, name: dbUser.name },
    });
  }

  const totalUsers = await db.adminUser.count();
  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (totalUsers === 0 && envEmail && email === envEmail) {
    return NextResponse.json({
      authenticated: true,
      user: { email: envEmail, name: "Super Admin (ENV)" },
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
