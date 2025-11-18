import { create } from "zustand";

export interface Toast {
  id?: string; // ID akan diberikan dari luar
  type: "success" | "error" | "warning" | "info" | "loading" | "confirm";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  confirmAction?: {
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Toast) => void; // Tidak perlu lagi generate ID secara acak
  removeToast: (id: string) => void;
  clearAll: () => void;
}

/**
 * Zustand store untuk mengelola state notifikasi global
 * Menyediakan fungsi untuk menambah, menghapus, dan membersihkan notifikasi
 */
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  /**
   * Menambahkan notifikasi baru ke dalam store
   * ID akan diterima dari luar
   */
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id: toast.id ?? id }; // Menerima toast dengan ID yang diberikan dari luar

    set((state) => ({
      toasts: [...state.toasts, newToast], // Menambahkan toast ke dalam state
    }));

    // Jika durasi tersedia dan bukan tipe "loading", otomatis hapus setelah waktu tertentu
    const duration = toast.duration ?? 5000;
    if (duration > 0 && toast.type !== "loading") {
      setTimeout(() => {
        get().removeToast(newToast.id); // Menghapus toast setelah durasi
      }, duration);
    }
  },

  /**
   * Menghapus notifikasi berdasarkan ID
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id), // Menghapus toast berdasarkan ID
    }));
  },

  /**
   * Menghapus semua notifikasi
   */
  clearAll: () => {
    set({ toasts: [] }); // Menghapus semua notifikasi
  },
}));
