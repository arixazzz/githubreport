import { fetcher } from "@/services/api/fetcher";
import { APIError } from "@/types/interface";
import { useQuery } from "@tanstack/react-query";

const fetchLog = async (
  params?: string
): Promise<ApiResponse<DataPaginate<LogAcivityResponse>>> => {
  return await fetcher(`log?${params}`);
};

export const useGetLog = (params?: string) => {
  return useQuery<ApiResponse<DataPaginate<LogAcivityResponse>>, APIError<any>>(
    {
      queryKey: ["useGetLog", params],
      queryFn: async () => {
        const response = await fetchLog(params);
        return response;
      },
    }
  );
};
export const useGetLogMe = (params?: string) => {
  return useQuery<ApiResponse<DataPaginate<LogAcivityResponse>>, APIError<any>>(
    {
      queryKey: ["useGetLogMe", params],
      queryFn: async () => {
        const response = await fetcher(`log/user?${params}`);
        return response;
      },
    }
  );
};

export const useGetLogBy = (id: number, params?: string) => {
  return useQuery<ApiResponse<DataPaginate<LogAcivityResponse>>, APIError<any>>(
    {
      queryKey: ["useGetLogBy", params],
      queryFn: async () => {
        const response = await fetcher(`log/${id}?${params}`);
        return response;
      },
    }
  );
};
