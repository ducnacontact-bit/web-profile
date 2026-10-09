import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// GET: Lấy tất cả dịch vụ cho Admin hoặc ngoài Client
export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy danh sách services:", error);
    return NextResponse.json({ error: "Lỗi tải dịch vụ" }, { status: 500 });
  }
}

// POST: Thêm mới một dịch vụ từ trang Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, iconName, shortDesc, fullDetail } = body;

    const newService = await db.service.create({
      data: {
        title,
        iconName: iconName || "Monitor", // Giá trị mặc định nếu không chọn icon
        shortDesc,
        fullDetail,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Lỗi thêm service:", error);
    return NextResponse.json(
      { error: "Không thể thêm dịch vụ" },
      { status: 500 },
    );
  }
}
