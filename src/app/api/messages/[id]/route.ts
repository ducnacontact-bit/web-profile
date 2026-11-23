import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"; // Điều chỉnh lại đường dẫn tương đối tùy vị trí file
import { requireAdmin } from "../../../../lib/admin-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    await db.message.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Xóa tin nhắn thành công" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi xóa tin nhắn:", error);
    return NextResponse.json(
      { error: "Lỗi server khi xóa tin nhắn" },
      { status: 500 },
    );
  }
}
