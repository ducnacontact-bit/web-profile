import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// GET: Lấy toàn bộ danh sách Resume từ Database
export async function GET() {
  try {
    const resumes = await db.resume.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(resumes, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Resume:", error);
    return NextResponse.json(
      { error: "Lỗi tải dữ liệu Resume từ Database" },
      { status: 500 },
    );
  }
}

// POST: Thêm mới một mục Resume vào Database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, time, title, desc, institution, role } = body;

    // Validate dữ liệu bắt buộc
    if (!type || !title || !time) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc (type, title, time)" },
        { status: 400 },
      );
    }

    const newResume = await db.resume.create({
      data: {
        type,
        time,
        title,
        desc: desc || "",
        institution: type === "education" ? institution : null,
        role: type === "experience" ? role : null,
      },
    });

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo Resume:", error);
    return NextResponse.json(
      { error: "Lỗi server khi thêm Resume" },
      { status: 500 },
    );
  }
}
