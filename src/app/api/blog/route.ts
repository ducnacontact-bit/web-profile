import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// GET: Lấy toàn bộ danh sách bài viết blog
export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy danh sách blog:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách bài viết" },
      { status: 500 },
    );
  }
}

// POST: Tạo bài viết blog mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, image, content } = body;

    if (!title || !excerpt || !image) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin bắt buộc" },
        { status: 400 },
      );
    }

    const newPost = await db.blogPost.create({
      data: {
        title,
        excerpt,
        image,
        content: content || "",
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo blog:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo bài viết" },
      { status: 500 },
    );
  }
}
