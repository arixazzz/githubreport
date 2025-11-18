import { z } from "zod";

const UserValidationBase = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Gender wajib diisi",
    invalid_type_error: "Gender hanya boleh MALE atau FEMALE",
  }),

  nik: z
    .string()
    .min(16, "NIK minimal 16 digit")
    .max(20, "NIK maksimal 20 digit"),
  position: z.string().min(1, "Jabatan wajib diisi"),
  workUnit: z.string().min(1, "Unit kerja wajib diisi"),
  phone: z.string().min(9, "Nomor HP minimal 9 digit"),
  address: z.string().min(1, "Alamat wajib diisi"),

  profilePicture: z.any().nullable().optional(),
});

export const UserProfileValidation = UserValidationBase.extend({});

export const UserValidation = UserValidationBase.extend({
  password: z.string().min(6, "Password minimal 6 karakter"),
  pin: z.string().regex(/^\d{6}$/, "PIN harus 6 digit angka"),
  email: z.string().email("Email tidak valid"),
  roleId: z.coerce
    .number({
      required_error: "Role wajib diisi",
      invalid_type_error: "Role harus berupa angka",
    })
    .or(z.string()),
});

export const UserValidationUpdate = UserValidationBase.extend({
  roleId: z.coerce
    .number({
      required_error: "Role wajib diisi",
      invalid_type_error: "Role harus berupa angka",
    })
    .or(z.string()),
});

// password

const ChangePasswordBase = z.object({
  newPassword: z
    .string({ required_error: "Password baru wajib diisi" })
    .min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z
    .string({ required_error: "Konfirmasi password wajib diisi" })
    .min(6, "Konfirmasi password minimal 6 karakter"),
});

export const ChangePasswordValidation = ChangePasswordBase.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    path: ["confirmPassword"], // error diarahkan ke confirmPassword
    message: "Konfirmasi password tidak sama dengan password baru",
  }
);

export const ChangePasswordUserValidation = ChangePasswordBase.extend({
  oldPassword: z.string().min(6, "Password lama minimal 6 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"], // error diarahkan ke confirmPassword
  message: "Konfirmasi password tidak sama dengan password baru",
});

const ChangePinBase = z.object({
  newPin: z
    .string({ required_error: "Pin baru wajib diisi" })
    .min(6, "Pin baru minimal 6 karakter")
    .max(6, "Pin baru maksimal 6 karakter"),
  confirmPin: z
    .string({ required_error: "Konfirmasi pin wajib diisi" })
    .min(6, "Konfirmasi password pin 6 karakter")
    .max(6, "Pin baru maksimal 6 karakter"),
});

export const ChangePinValidation = ChangePinBase.refine(
  (data) => data.newPin === data.confirmPin,
  {
    path: ["confirmPin"], // error diarahkan ke confirmPassword
    message: "Konfirmasi pin tidak sama dengan pin baru",
  }
);

export const ChangePinuserValidation = ChangePinBase.extend({
  oldPin: z.string().min(6, "Pin lama minimal 6 karakter"),
}).refine((data) => data.newPin === data.confirmPin, {
  path: ["confirmPin"], // error diarahkan ke confirmPassword
  message: "Konfirmasi pin tidak sama dengan pin baru",
});

// infer

export type UserPayload = z.infer<typeof UserValidation>;
export type UserProfilePayload = z.infer<typeof UserProfileValidation>;
export type ChangePasswordPayload = z.infer<typeof ChangePasswordValidation>;
export type ChangePasswordUserPayload = z.infer<
  typeof ChangePasswordUserValidation
>;
export type ChangePinPayload = z.infer<typeof ChangePinValidation>;
export type ChangePinUserPayload = z.infer<typeof ChangePinuserValidation>;
