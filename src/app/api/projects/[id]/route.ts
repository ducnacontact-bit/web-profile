import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"; // Điều chỉnh lại đường dẫn relative cho khớp với thư mục của bạn[cite: 12]

// 1. API Cập nhật dự án (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const body = await request.json();
    const { title, category, image, span, desc } = body;

    const updatedProject = await db.project.update({
      where: { id },
      data: {
        title,
        category,
        image,
        span,
        desc,
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật dự án:", error);
    return NextResponse.json(
      { error: "Lỗi Server khi cập nhật dự án" },
      { status: 500 },
    );
  }
}

// 2. API Xóa dự án (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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
