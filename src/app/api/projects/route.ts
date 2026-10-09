import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn

// GET: Lấy tất cả dự án cho Admin hoặc Client
export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy danh sách projects:", error);
    return NextResponse.json({ error: "Lỗi tải dự án" }, { status: 500 });
  }
}

// POST: Thêm mới một dự án từ trang Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, image, span, desc } = body;

    const newProject = await db.project.create({
      data: {
        title,
        category,
        image,
        span: span || "col-span-1 row-span-1",
        desc,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Lỗi thêm project:", error);
    return NextResponse.json(
      { error: "Không thể thêm dự án" },
      { status: 500 },
    );
  }
}
