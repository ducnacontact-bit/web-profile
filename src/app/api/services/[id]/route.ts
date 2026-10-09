import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

// PUT: Cập nhật thông tin dịch vụ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const body = await request.json();
    const { title, iconName, shortDesc, fullDetail } = body;

    const updatedService = await db.service.update({
      where: { id },
      data: {
        title,
        iconName,
        shortDesc,
        fullDetail,
      },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật service:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật dịch vụ" },
      { status: 500 },
    );
  }
}

// DELETE: Xóa dịch vụ
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    await db.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Lỗi xóa service:", error);
    return NextResponse.json(
      { error: "Không thể xóa dịch vụ" },
      { status: 500 },
    );
  }
}
