import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Khai báo params là Promise
) {
  try {
    const resolvedParams = await params; // Phải await params trước khi dùng
    await db.skill.delete({
      where: { id: Number(resolvedParams.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi xóa kỹ năng:", error);
    return NextResponse.json({ error: "Lỗi xóa kỹ năng" }, { status: 500 });
  }
}
