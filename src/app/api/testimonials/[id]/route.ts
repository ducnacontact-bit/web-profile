import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

// PUT: Cập nhật Testimonial theo ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const body = await request.json();
    const { name, role, image, content } = body;

    if (!name || !role || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin bắt buộc" },
        { status: 400 },
      );
    }

    const updatedTestimonial = await db.testimonial.update({
      where: { id },
      data: {
        name,
        role,
        image:
          image ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        content,
      },
    });

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Không tìm thấy bản ghi để cập nhật" },
        { status: 404 },
      );
    }
    console.error("Lỗi cập nhật testimonial:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE: Xóa Testimonial theo ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    await db.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa thành công" }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Không tìm thấy bản ghi để xóa" },
        { status: 404 },
      );
    }
    console.error("Lỗi xóa testimonial:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
