import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    let hero = await db.heroSection.findFirst();
    if (!hero) {
      hero = await db.heroSection.create({
        data: {
          greeting: "Hello,",
          roles: "Electrical Engineer,Developer,Creator",
          description: "Tôi xây dựng những sản phẩm đơn giản, hữu ích...",
          darkBgUrl: "",
          lightBgUrl: "",
          socials: "[]", // Thêm giá trị mặc định cho socials
        },
      });
    }
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải dữ liệu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      greeting,
      roles,
      description,
      socials, // Nhận thêm trường socials được gửi lên từ AdminDashboard
      darkBgUrl,
      lightBgUrl,
    } = body;

    let hero = await db.heroSection.findFirst();

    const dataToSave = {
      greeting,
      roles,
      description,
      socials:
        typeof socials === "string" ? socials : JSON.stringify(socials || []), // Đảm bảo lưu dưới dạng chuỗi JSON
      darkBgUrl,
      lightBgUrl,
    };

    if (hero) {
      hero = await db.heroSection.update({
        where: { id: hero.id },
        data: dataToSave,
      });
    } else {
      hero = await db.heroSection.create({
        data: dataToSave,
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}
