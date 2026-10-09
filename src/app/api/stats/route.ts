import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn

export async function GET() {
  try {
    const stats = await db.stat.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy thống kê" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, value, label } = body;

    const updatedStat = await db.stat.update({
      where: { id: Number(id) },
      data: { value, label },
    });

    return NextResponse.json(updatedStat, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi cập nhật thống kê" },
      { status: 500 },
    );
  }
}
