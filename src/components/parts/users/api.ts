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

// 🔹 Fetch user detail yang aman
const fetchUserDetail = async (): Promise<
  ApiResponse<DataObject<UserDetailResponse>>
> => {
  try {
    const response =
      await offlineFetcher<ApiResponse<DataObject<UserDetailResponse>>>(
        "user/detail"
      );
    // pastikan selalu return object
    return (
      response ?? ({ data: {} } as ApiResponse<DataObject<UserDetailResponse>>)
    );
  } catch (err) {
    console.warn("⚠️ fetchUserDetail failed:", err);
    return { data: {} } as ApiResponse<DataObject<UserDetailResponse>>;
  }
};

// 🔹 Hook untuk get user detail
export const useGetUserDetail = () => {
  const { setUser } = useStore(useProfile);

  return useQuery({
    queryKey: ["useGetUserDetail"],
    queryFn: async () => {
      const response = await fetchUserDetail();
      const userData = response?.data ?? {}; // default object
      setUser(userData);
      return response;
    },
    networkMode: "offlineFirst",
    retry: false, // optional, matikan retry otomatis
    select: (data) => data ?? { data: {} }, // aman jika null
  } as const);
};

// 🔹 Hook untuk update profile
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

// 🔹 Hook untuk ganti password
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
