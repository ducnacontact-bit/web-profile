import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// GET: Lấy tất cả cấu hình
export async function GET() {
  try {
    const settings = await db.setting.findMany();
    const settingsMap = settings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("LỖI GET SETTINGS:", error);
    return NextResponse.json({ error: "Lỗi tải cấu hình" }, { status: 500 });
  }
}

// POST/PUT: Lưu hoặc cập nhật cấu hình
export async function POST(request: Request) {
  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await db.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    return NextResponse.json({ message: "Cập nhật cấu hình thành công!" });
  } catch (error) {
    // In lỗi chi tiết ra terminal của VS Code để chúng ta đọc
    console.error("CHI TIẾT LỖI POST SETTINGS:", error);
    return NextResponse.json(
      { error: "Lỗi cập nhật cấu hình", details: String(error) },
      { status: 500 },
    );
  }
}
