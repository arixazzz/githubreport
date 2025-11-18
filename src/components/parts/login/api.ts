import { useFormMutation } from "@/hooks/useFormMutation";
import { sendData } from "@/services/api/fetcher";
import { LoginData } from "@/types/interface";
import { unsubscribeWebPush } from "../webpush/api";
import {
  ForgoutPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
} from "./validation";

export const useLoginMutation = () => {
  return useFormMutation<
    ApiResponse<DataObject<LoginData>>,
    Error,
    LoginPayload
  >({
    mutationFn: async (payload: LoginPayload) => {
      return await sendData("auth/login", payload, "POST");
    },
    successMessage: "Berhasil Login",
  });
};

export const useLogoutMutation = () => {
  return useFormMutation<ApiResponse<DataObject<null>>, Error, undefined>({
    mutationFn: async () => {
      await unsubscribeWebPush();
      return await sendData("auth/logout", {}, "DELETE");
    },
    successMessage: "Berhasil Keluar",
  });
};

export const useForgoutMutation = () => {
  return useFormMutation<
    ApiResponse<DataObject<null>>,
    Error,
    ForgoutPasswordPayload
  >({
    mutationFn: async (payload) => {
      return await sendData("reset-password/verify-email", payload, "POST");
    },
    successMessage: "Berhasil Mengirimkan OTP",
  });
};

export const useVerificationOtpMutation = () => {
  return useFormMutation<
    ApiResponse<DataObject<{ token: string }>>,
    Error,
    { otp: string }
  >({
    mutationFn: async (payload) => {
      return await sendData("reset-password/verify-otp", payload, "POST");
    },
    successMessage: "Berhasil Memverifikasi OTP",
  });
};
export const useResetPasswordMutation = (token?: string) => {
  return useFormMutation<
    ApiResponse<DataObject<null>>,
    Error,
    ResetPasswordPayload
  >({
    mutationFn: async (payload) => {
      return await sendData(
        `reset-password/change-password?token=${token}`,
        payload,
        "PUT"
      );
    },
    successMessage: "Berhasil Reset Password",
  });
};
