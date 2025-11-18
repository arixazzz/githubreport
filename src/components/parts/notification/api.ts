import { fetcher, sendData } from "@/services/api/fetcher";
import { APIError } from "@/types/interface";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchNotification = async (
  params?: string
): Promise<ApiResponse<DataPaginate<NotificationResponse>>> => {
  return await fetcher(`notification?${params}`, 0);
};

export const useGetNotification = (params?: string) => {
  return useQuery<
    ApiResponse<DataPaginate<NotificationResponse>>,
    APIError<string>
  >({
    queryKey: ["useGetNotification", params],
    queryFn: async () => {
      const response = await fetchNotification(params);
      return response;
    },
  });
};

export const useGetNotificationCount = (params?: string) => {
  return useQuery<
    ApiResponse<DataObject<NotificationCountResponse>>,
    APIError<string>
  >({
    queryKey: ["useGetNotificationCount", params],
    queryFn: async () => {
      const response = await fetcher(`notification/unread?${params ?? ""}`);
      return response;
    },
  });
};

export const useReadNotificationMutation = () => {
  return useMutation<ApiResponse<DataObject<{}>>, Error, { id?: number }>({
    mutationFn: async (payload) => {
      return await sendData(
        payload.id
          ? `notification/${payload.id}/read`
          : "notification/read-all",
        {},
        "PATCH"
      );
    },
  });
};
