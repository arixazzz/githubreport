import { PrismaClient } from "@prisma/client";
import { seedRBAC } from "./seed/rbac.seed";
import { seedAdmin } from "./seed/admin.seed";
import { seedUser } from "./seed/user.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Running database seed...");

  await seedRBAC();
  await seedAdmin();
  await seedUser();

  console.log("Database seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
