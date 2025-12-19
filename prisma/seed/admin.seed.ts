import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedAdmin() {
  const ADMIN_EMAIL = "bulindev@gmail.com";
  const ADMIN_GITHUB = "bulindev";
  const ADMIN_PASSWORD = "BulinDev12345!";
  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  if (!adminRole) {
    throw new Error(
      "Role ADMIN belum ada. Jalankan seed RBAC terlebih dahulu."
    );
  }
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      nama: "System Administrator",
      email: ADMIN_EMAIL,
      usernamegithub: ADMIN_GITHUB,
      password: hashedPassword,
      position: "Administrator",
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("Admin user seeded");
}
