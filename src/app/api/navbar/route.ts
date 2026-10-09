import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// GET: Lấy danh sách menu navbar
export async function GET() {
  try {
    const navItems = await db.navbarItem.findMany({
      where: { parentId: null }, // Chỉ lấy menu gốc ở cấp cao nhất
      include: { children: true }, // Kèm theo các mục con trực thuộc
      orderBy: { id: "asc" },
    });
    return NextResponse.json(navItems, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải menu" }, { status: 500 });
  }
}

// POST: Thêm mục menu navbar mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, parentId } = body;

    const newNav = await db.navbarItem.create({
      data: {
        title,
        url,
        parentId: parentId ? Number(parentId) : null,
      },
    });

    return NextResponse.json(newNav, { status: 201 });
  } catch (error) {
    console.error("Lỗi thêm navbar:", error);
    return NextResponse.json(
      { error: "Lỗi khi thêm mục menu" },
      { status: 500 },
    );
  }
}
