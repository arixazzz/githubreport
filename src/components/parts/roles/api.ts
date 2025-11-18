import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useFormMutation } from "@/hooks/useFormMutation";
import { offlineSendData } from "@/services/api/offlineFetcher";
import { RolesPayload } from "./validation";

export const useGetMasterPermission = () => {
  return useCustomQuery<ApiResponse<DataArray<PermissionResponse>>, Error>({
    queryKey: ["useGetPermission"],
    queryUrl: "master/role/permissions",
  });
};

export const useGetRoles = (props?: string) => {
  return useCustomQuery<ApiResponse<DataPaginate<RolesResponse>>, Error>({
    queryKey: ["useGetRoles", props],
    queryUrl: `master/role?${props}`,
  });
};

export const useGetRolesDetail = (id: number) => {
  return useCustomQuery<ApiResponse<DataObject<RolesDetailResponse>>, Error>({
    queryKey: ["useGetRolesDetail", id],
    queryUrl: `master/role/${id}`,
    enabled: !!id,
  });
};

export const useRolesMutation = (id?: number) => {
  return useFormMutation<
    ApiResponse<DataObject<RolesPayload>>,
    Error,
    RolesPayload
  >({
    mutationFn: async (payload) => {
      return await offlineSendData(
        id ? `master/role/${id}` : `master/role/`,
        payload,
        id ? "PUT" : "POST"
      );
    },
    successMessage: `Berhasil ${id ? "Mengupdate" : "Menambah"} Roles`,
  });
};
