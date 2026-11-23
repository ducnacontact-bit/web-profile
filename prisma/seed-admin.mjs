import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function main() {
  const email = "admin@gmail.com"; // Đổi thành email của bạn
  const password = "123456789"; // Đổi thành mật khẩu của bạn

  const user = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: {
      passwordHash: hashPassword(password),
      isActive: true,
    },
    create: {
      email: email.toLowerCase(),
      name: "Nguyễn Anh Đức",
      passwordHash: hashPassword(password),
      isActive: true,
    },
  });

  console.log("Đã lưu admin vào Supabase:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
