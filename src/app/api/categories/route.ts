import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn
// GET: Lấy danh sách danh mục
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error);
    return NextResponse.json(
      { error: "Lỗi tải danh mục từ server" },
      { status: 500 },
    );
  }
}

// POST: Thêm mới danh mục
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Tên danh mục không được để trống" },
        { status: 400 },
      );
    }

    // Kiểm tra xem danh mục đã tồn tại hay chưa (tùy chọn)
    const existingCategory = await db.category.findFirst({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Danh mục này đã tồn tại" },
        { status: 400 },
      );
    }

    const newCategory = await db.category.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    return NextResponse.json(
      { error: "Không thể thêm danh mục do lỗi hệ thống" },
      { status: 500 },
    );
  }
}
