import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Hoặc "@/lib/db" tùy theo vị trí file của bạn

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy dữ liệu testimonials" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, image, content } = body;

    if (!name || !role || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin bắt buộc" },
        { status: 400 },
      );
    }

    const newTestimonial = await db.testimonial.create({
      data: {
        name,
        role,
        image:
          image ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        content,
      },
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo testimonial" }, { status: 500 });
  }
}
