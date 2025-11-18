"use client";

import { useFormMutation } from "@/hooks/useFormMutation";
import { sendData } from "@/services/api/fetcher";
import { offlineFetcher } from "@/services/api/offlineFetcher";
import { useProfile } from "@/store/userStore";
import { APIError } from "@/types/interface";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import {
  ChangePasswordPayload,
  ChangePasswordUserPayload,
  UserProfilePayload,
} from "./validation";

const fetchUserDetail = async (): Promise<
  ApiResponse<DataObject<UserDetailResponse>>
> => {
  return await offlineFetcher(`auth/me`, { queryKey: ["useGetUserDetail"] });
};

export const useGetUserDetail = () => {
  const { setUser } = useStore(useProfile);
  return useQuery<ApiResponse<DataObject<UserDetailResponse>>, APIError<any>>({
    queryKey: ["useGetUserDetail"],
    queryFn: async () => {
      const response = await fetchUserDetail();
      setUser(response.data);
      return response;
    },
    networkMode: "offlineFirst",
  });
};

export const useUserProfileMutation = () => {
  return useFormMutation<
    ApiResponse<DataObject<UserProfilePayload>>,
    Error,
    UserProfilePayload
  >({
    mutationFn: async (payload) => {
      return await sendData(`profile/update`, payload, "PUT", true);
    },
    successMessage: `Berhasil Memperbaharui Profile User`,
  });
};

export const useUserPasswordMutation = (userId?: number) => {
  return useFormMutation<
    ApiResponse<DataObject<{ token: string | null }>>,
    Error,
    ChangePasswordUserPayload | ChangePasswordPayload
  >({
    mutationFn: async (payload) => {
      return await sendData(
        userId
          ? `profile/change-password?userId=${userId}`
          : `profile/change-password`,
        payload,
        "PUT"
      );
    },
    successMessage: `Berhasil Memperbaharui Password User`,
  });
};
