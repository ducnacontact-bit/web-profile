import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    await db.navbarItem.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    return NextResponse.json(
      { error: "Không thể xóa mục Navbar này" },
      { status: 500 },
    );
  }
}
