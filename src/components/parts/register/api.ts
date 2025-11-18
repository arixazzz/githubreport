import { useMutation } from "@tanstack/react-query";
import { RegisterPayload } from "./validation";
import { sendData } from "@/services/api/fetcher";
import { RegisterData } from "./interface";
import { useFormMutation } from "@/hooks/useFormMutation";

export const useRegisterMutation = () => {
  return useFormMutation<
    ApiResponse<DataObject<RegisterData>>,
    Error,
    RegisterPayload
  >({
    mutationFn: async (payload: RegisterPayload) => {
      return await sendData("auth/register", payload, "POST");
    },
    successMessage: "Berhasil registrasi",
  });
};
