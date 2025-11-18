import { create } from "zustand";

type FormProfileProps = {
  edit: boolean;
  openEdit: () => void;
  closeEdit: () => void;
};

export const FormProfileStore = create<FormProfileProps>((set) => ({
  edit: false,
  openEdit: () => set(() => ({ edit: true })),
  closeEdit: () => set(() => ({ edit: false })),
}));
