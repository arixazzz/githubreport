import { create } from "zustand";

type userStoreProps = {
  user?: UserDetailResponse;
  setUser: (data?: UserDetailResponse) => void;
};

export const useProfile = create<userStoreProps>((set) => ({
  user: undefined,
  setUser: (data) => set({ user: data }),
}));
