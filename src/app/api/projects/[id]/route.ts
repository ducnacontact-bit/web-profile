import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Khai báo params là một Promise (Next.js 15+)
) {
  try {
    // Phải await params trước khi lấy id ra sử dụng
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Xóa dự án thành công" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi xóa dự án:", error);
    return NextResponse.json(
      { error: "Lỗi Server khi xóa dự án" },
      { status: 500 },
    );
  }
}
