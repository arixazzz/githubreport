import { z } from "zod";

const PermissionSchema = z.object({
  id: z.coerce.number().optional(),
  permissionId: z.number().int("permissionId harus berupa angka bulat"),
  canRead: z.boolean(),
  canWrite: z.boolean(),
  canRestore: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});

export const RolesValidation = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  permissions: z.array(PermissionSchema).min(1, "Minimal satu permission"),
});

// === Type inference dari schema ===
export type RolesPayload = z.infer<typeof RolesValidation>;
