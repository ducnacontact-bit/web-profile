import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

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
          socials: "[]",
        },
      });
    }
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải dữ liệu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { greeting, roles, description, socials, darkBgUrl, lightBgUrl } =
      body;

    let hero = await db.heroSection.findFirst();

    const dataToSave = {
      greeting,
      roles,
      description,
      socials:
        typeof socials === "string" ? socials : JSON.stringify(socials || []),
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

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(hero);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}
