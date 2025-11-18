import { useFormMutation } from "@/hooks/useFormMutation";
import { fetcher, sendData } from "@/services/api/fetcher";
import { useQuery } from "@tanstack/react-query";
import { UserPayload } from "../../users/validation";

export const useGetUsers = (props?: string) => {
  return useQuery<ApiResponse<DataPaginate<UsersResponse>>, Error>({
    queryKey: ["useGetUsers", props],
    queryFn: async () => {
      const response = await fetcher(`master/user?${props}`);
      return response;
    },
  });
};

export const useGetUsersDetail = (id: number) => {
  return useQuery<ApiResponse<DataObject<UsersDetailResponse>>, Error>({
    queryKey: ["useGetUsersDetail", id],
    queryFn: async () => {
      const response = await fetcher(`master/user/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useUsersMutation = (id?: number) => {
  return useFormMutation<
    ApiResponse<DataObject<UserPayload>>,
    Error,
    UserPayload
  >({
    mutationFn: async (payload) => {
      return await sendData(
        id ? `master/user/${id}` : `master/user`,
        payload,
        id ? "PUT" : "POST",
        false
      );
    },
    successMessage: `Berhasil ${id ? "Mengupdate" : "Menambah"} User`,
  });
};
