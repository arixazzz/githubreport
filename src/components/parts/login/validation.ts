import { z } from "zod";

export const loginValidation = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginPayload = z.infer<typeof loginValidation>;

export const forgoutPasswordValidation = z.object({
  email: z.string().email("Email tidak valid"),
});

export type ForgoutPasswordPayload = z.infer<typeof forgoutPasswordValidation>;

export const resetPasswordValidation = z.object({
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export type ResetPasswordPayload = z.infer<typeof resetPasswordValidation>;
