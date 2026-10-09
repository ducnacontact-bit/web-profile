import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    let about = await db.aboutSection.findFirst();
    if (!about) {
      about = await db.aboutSection.create({
        data: {
          image: "/shinn.jpg",
          paragraph1:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit...",
          paragraph2: "Excepteur sint occaecat cupidatat non proident...",
          hireMeUrl: "#contact",
          cvUrl: "/cv.pdf",
        },
      });
    }
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi tải dữ liệu About" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, paragraph1, paragraph2, hireMeUrl, cvUrl } = body;

    let about = await db.aboutSection.findFirst();
    if (about) {
      about = await db.aboutSection.update({
        where: { id: about.id },
        data: { image, paragraph1, paragraph2, hireMeUrl, cvUrl },
      });
    } else {
      about = await db.aboutSection.create({
        data: { image, paragraph1, paragraph2, hireMeUrl, cvUrl },
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error("LỖI CHI TIẾT TRONG API ABOUT:", error); // <-- In lỗi thật ra terminal
    return NextResponse.json(
      { error: "Không thể cập nhật About", details: String(error) }, // Trả về chi tiết để xem trên trình duyệt luôn
      { status: 500 },
    );
  }
}
