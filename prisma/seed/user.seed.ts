import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUser() {
  const USER_EMAIL = "user@gmail.com";
  const USER_GITHUB = "usergithub";
  const USER_PASSWORD = "User12345!"; // Default password

  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (!userRole) {
    // If USER role doesn't exist, we might want to create it or throw error.
    // Assuming RBAC seed runs first.
    console.warn("Role USER not found. Skipping user seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10);

  const regularUser = await prisma.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: {
      nama: "Regular User",
      email: USER_EMAIL,
      usernamegithub: USER_GITHUB,
      password: hashedPassword,
      position: "Developer",
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: regularUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  });

  console.log("Regular User seeded");
}
