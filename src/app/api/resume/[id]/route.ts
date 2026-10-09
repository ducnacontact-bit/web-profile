import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Phải await params trước khi lấy id trên Next.js 15+
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    await db.resume.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Đã xóa mục Resume thành công" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi xóa Resume:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa mục Resume trong Database" },
      { status: 500 },
    );
  }
}
// PUT: Cập nhật mục Resume theo ID
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
    const { type, time, title, desc, institution, role } = body;

    if (!type || !title || !time) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc (type, title, time)" },
        { status: 400 },
      );
    }

    const updatedResume = await db.resume.update({
      where: { id },
      data: {
        type,
        time,
        title,
        desc: desc || "",
        institution: type === "education" ? institution : null,
        role: type === "experience" ? role : null,
      },
    });

    return NextResponse.json(updatedResume, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật Resume:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật mục Resume trong Database" },
      { status: 500 },
    );
  }
}
