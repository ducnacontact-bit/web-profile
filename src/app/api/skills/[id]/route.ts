import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"; // Điều chỉnh lại đường dẫn tương đối cho khớp với thư mục của bạn

// 1. Cập nhật kỹ năng (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const body = await request.json();
    const { name, percentage, category } = body;

    const updatedSkill = await db.skill.update({
      where: { id },
      data: {
        name,
        percentage: Number(percentage), // Ép kiểu số nguyên
        category,
      },
    });

    return NextResponse.json(updatedSkill, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật kỹ năng:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật kỹ năng" },
      { status: 500 },
    );
  }
}

// 2. Xóa kỹ năng (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    await db.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Lỗi xóa kỹ năng:", error);
    return NextResponse.json({ error: "Lỗi khi xóa kỹ năng" }, { status: 500 });
  }
}
