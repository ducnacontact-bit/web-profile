import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const skills = await db.skill.findMany();
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Lỗi GET skills:", error); // In lỗi ra terminal để dễ debug nếu còn vấn đề khác
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách kỹ năng" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, percentage, category } = body;

    const newSkill = await db.skill.create({
      data: {
        name,
        percentage: Number(percentage), // Ép kiểu string sang Int ở đây
        category,
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Lỗi POST skills:", error); // In chi tiết lỗi ra console
    return NextResponse.json(
      { error: "Lỗi khi thêm kỹ năng" },
      { status: 500 },
    );
  }
}
