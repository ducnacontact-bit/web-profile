import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // Điều chỉnh lại đường dẫn tương đối tùy vị trí file của bạn

// GET: Lấy danh sách tất cả tin nhắn từ Database để hiển thị cho Admin
export async function GET() {
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy danh sách tin nhắn:", error);
    return NextResponse.json(
      { error: "Lỗi tải danh sách tin nhắn từ Database" },
      { status: 500 },
    );
  }
}

// POST: Lưu tin nhắn mới khi khách hàng gửi form từ trang Contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, budget, message } = body;

    // Validate thông tin bắt buộc
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tên, email và nội dung tin nhắn" },
        { status: 400 },
      );
    }

    const newMessage = await db.message.create({
      data: {
        name,
        email,
        budget: budget || "",
        message,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi lưu tin nhắn:", error);
    return NextResponse.json(
      { error: "Lỗi server khi lưu tin nhắn" },
      { status: 500 },
    );
  }
}
