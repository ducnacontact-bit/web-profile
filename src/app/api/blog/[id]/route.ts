import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

// PUT: Cập nhật bài viết blog theo ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const body = await request.json();
    const { title, excerpt, image, content } = body;

    const updatedPost = await db.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        image,
        content: content || "",
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật blog:", error);
    return NextResponse.json(
      { error: "Lỗi server khi cập nhật bài viết" },
      { status: 500 },
    );
  }
}

// DELETE: Xóa bài viết blog theo ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    await db.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài viết thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa blog:", error);
    return NextResponse.json(
      { error: "Lỗi server khi xóa bài viết" },
      { status: 500 },
    );
  }
}
