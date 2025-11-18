import { useFormMutation } from "@/hooks/useFormMutation";
import { offlineSendData } from "@/services/api/offlineFetcher";

export const useDelete = () => {
  return useFormMutation<
    ApiResponse<DataObject<any>>,
    Error,
    { endpoint: string }
  >({
    mutationFn: async (data): Promise<ApiResponse<DataObject<any>>> => {
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));

      const [result] = await Promise.all([
        offlineSendData(data.endpoint, {}, "DELETE") as Promise<
          ApiResponse<DataObject<any>>
        >,
        delay,
      ]);

      return result;
    },
    loadingMessage: "Menghapus data...",
    successMessage: "Data berhasil dihapus",
  });
};
