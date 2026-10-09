import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn

// PUT: Cập nhật danh mục theo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Tên danh mục không được để trống" },
        { status: 400 },
      );
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật danh mục" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await context.params;
    // Chuyển id sang kiểu số (Number) vì database dùng Int (phù hợp với hàm PUT)
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Thực hiện xóa
    const deletedCategory = await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa thành công", deletedCategory });
  } catch (error: any) {
    // Mã lỗi P2025 của Prisma: Record to delete does not exist.
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục để xóa" },
        { status: 404 },
      );
    }

    console.error("Lỗi xóa danh mục:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
