import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

const DEFAULT_CONTACT = {
  phone: "+0044 545 989 626\n+8801 909 130 830",
  address: "28 Green Tower, Street Name,\nNew York City, USA",
  email: "www.marveltheme.com\nwww.yourmail@gmail.com",
};

export async function GET() {
  try {
    const info = await db.contactInfo.findFirst({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: info || DEFAULT_CONTACT,
    });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi tải thông tin liên hệ." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const phone = String(body?.phone ?? "").trim();
    const address = String(body?.address ?? "").trim();
    const email = String(body?.email ?? "").trim();

    if (!phone || !address || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập đầy đủ phone, address và email.",
        },
        { status: 400 },
      );
    }

    const existing = await db.contactInfo.findFirst({
      orderBy: { id: "asc" },
    });

    const saved = existing
      ? await db.contactInfo.update({
          where: { id: existing.id },
          data: { phone, address, email },
        })
      : await db.contactInfo.create({
          data: { phone, address, email },
        });

    return NextResponse.json(
      {
        success: true,
        message: "Cập nhật thông tin liên hệ thành công!",
        data: saved,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi lưu cấu hình contact." },
      { status: 500 },
    );
  }
}
