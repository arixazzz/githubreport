import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRBAC() {
  const permissions = [
    { name: "project:create", description: "Create project" },
    { name: "project:read", description: "Read project" },
    { name: "project:update", description: "Update project" },
    { name: "project:delete", description: "Delete project" },
    { name: "report:generate", description: "Generate report" },
    { name: "report:read:own", description: "Read own report" },
    { name: "report:read:all", description: "Read all reports (admin)" },
  ];
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }
  const roles = [
    {
      name: "USER",
      description: "Regular user",
      permissions: ["project:read", "report:generate", "report:read:own"],
    },
    {
      name: "ADMIN",
      description: "System administrator",
      permissions: [
        "project:create",
        "project:read",
        "project:update",
        "project:delete",
        "report:read:all",
      ],
    },
  ];

  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description,
      },
    });

    for (const permissionName of role.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: createdRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: createdRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log("Roles & permissions Seeder");
}
