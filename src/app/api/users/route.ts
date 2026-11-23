import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import {
  getAuthenticatedAdminEmail,
  hashPassword,
} from "../../../lib/admin-auth";

export async function GET() {
  const currentEmail = await getAuthenticatedAdminEmail();
  if (!currentEmail) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  return NextResponse.json({ users, currentEmail });
}

export async function POST(req: Request) {
  const currentEmail = await getAuthenticatedAdminEmail();
  if (!currentEmail) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  try {
    const { email, name, password, isActive = true } = await req.json();
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email không hợp lệ." },
        { status: 400 },
      );
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu tối thiểu 6 ký tự." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await db.adminUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (exists) {
      return NextResponse.json({ error: "Email đã tồn tại." }, { status: 409 });
    }

    const user = await db.adminUser.create({
      data: {
        email: normalizedEmail,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
        passwordHash: hashPassword(password),
        isActive: Boolean(isActive),
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Lỗi tạo tài khoản." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const currentEmail = await getAuthenticatedAdminEmail();
  if (!currentEmail) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  try {
    const { id, isActive, name, password } = await req.json();
    const userId = Number(id);
    if (!userId) {
      return NextResponse.json(
        { error: "Thiếu ID tài khoản." },
        { status: 400 },
      );
    }

    const target = await db.adminUser.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    if (typeof isActive === "boolean" && isActive === false) {
      if (target.email.toLowerCase() === currentEmail.toLowerCase()) {
        return NextResponse.json(
          { error: "Không thể tự khóa tài khoản đang đăng nhập." },
          { status: 400 },
        );
      }
      const activeCount = await db.adminUser.count({
        where: { isActive: true },
      });
      if (activeCount <= 1) {
        return NextResponse.json(
          { error: "Phải giữ ít nhất 1 tài khoản đang hoạt động." },
          { status: 400 },
        );
      }
    }

    const dataToUpdate: {
      isActive?: boolean;
      name?: string | null;
      passwordHash?: string;
    } = {};

    if (typeof isActive === "boolean") dataToUpdate.isActive = isActive;
    if (name !== undefined) {
      dataToUpdate.name =
        typeof name === "string" && name.trim() ? name.trim() : null;
    }
    if (typeof password === "string" && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Mật khẩu mới tối thiểu 6 ký tự." },
          { status: 400 },
        );
      }
      dataToUpdate.passwordHash = hashPassword(password);
    }

    const user = await db.adminUser.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json(
      { error: "Lỗi cập nhật tài khoản." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const currentEmail = await getAuthenticatedAdminEmail();
  if (!currentEmail) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  try {
    const userId = Number(new URL(req.url).searchParams.get("id"));
    if (!userId) {
      return NextResponse.json(
        { error: "Thiếu ID tài khoản." },
        { status: 400 },
      );
    }

    const target = await db.adminUser.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    if (target.email.toLowerCase() === currentEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Không thể xóa tài khoản đang đăng nhập." },
        { status: 400 },
      );
    }

    const total = await db.adminUser.count();
    if (total <= 1) {
      return NextResponse.json(
        { error: "Không thể xóa tài khoản cuối cùng." },
        { status: 400 },
      );
    }

    await db.adminUser.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "Lỗi xóa tài khoản." }, { status: 500 });
  }
}
