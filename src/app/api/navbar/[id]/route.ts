import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"; // Trỏ đúng đường dẫn đến file khởi tạo Prisma/DB của bạn

// PUT: Cập nhật mục menu Navbar theo ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const body = await request.json();
    const { title, url } = body;

    const updatedNav = await db.navbarItem.update({
      where: { id },
      data: {
        title,
        url,
      },
    });

    return NextResponse.json(updatedNav, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật navbar:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật menu" },
      { status: 500 },
    );
  }
}

// DELETE: Xóa mục menu Navbar theo ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    // Tiến hành xóa trong Database (nếu có bảng con, Prisma sẽ tự xử lý hoặc bạn cần xóa mục con trước tùy vào cấu hình schema)
    await db.navbarItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Đã xóa thành công" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi xóa navbar:", error);
    return NextResponse.json({ error: "Không thể xóa menu" }, { status: 500 });
  }
}
