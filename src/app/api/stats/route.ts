import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn
import { requireAdmin } from "../../../lib/admin-auth";

export async function GET() {
  try {
    const stats = await db.stat.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy thống kê" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

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
