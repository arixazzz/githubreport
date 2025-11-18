import { z } from "zod";

export const registerValidation = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Password minimal 6 karakter"),
});

export type RegisterPayload = z.infer<typeof registerValidation>;
