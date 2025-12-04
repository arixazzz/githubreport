import { z } from "zod";

export const loginValidation = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginPayload = z.infer<typeof loginValidation>;

export const forgoutPasswordValidation = z.object({
  username: z.string().min(1, "Username wajib diisi"),
});

export type ForgoutPasswordPayload = z.infer<typeof forgoutPasswordValidation>;

export const resetPasswordValidation = z.object({
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export type ResetPasswordPayload = z.infer<typeof resetPasswordValidation>;
