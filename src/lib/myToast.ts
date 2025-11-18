import { useToastStore } from "@/components/shared/toast/toastStore";

const { addToast, removeToast } = useToastStore.getState();

/**
 * Fungsi untuk menampilkan toast dengan berbagai tipe
 */
export const toast = {
  /**
   * Menampilkan notifikasi sukses
   */
  success: (
    title: string,
    message?: string,
    options?: {
      id?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    addToast({
      id: options?.id,
      type: "success",
      title,
      message,
      ...options,
    });
  },

  /**
   * Menampilkan notifikasi error
   */
  error: (
    title: string,
    message?: string,
    options?: {
      id?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    addToast({
      id: options?.id,
      type: "error",
      title,
      message,
      ...options,
    });
  },

  /**
   * Menampilkan notifikasi warning
   */
  warning: (
    title: string,
    message?: string,
    options?: {
      id?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    addToast({
      id: options?.id,
      type: "warning",
      title,
      message,
      ...options,
    });
  },

  /**
   * Menampilkan notifikasi info
   */
  info: (
    title: string,
    message?: string,
    options?: {
      id?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    addToast({
      id: options?.id,
      type: "info",
      title,
      message,
      ...options,
    });
  },

  /**
   * Menampilkan notifikasi loading
   * Mengembalikan ID untuk toast loading agar bisa dihapus nanti
   */
  loading: (
    title: string,
    message?: string,
    options?: {
      id?: string;
      duration?: number; // Waktu tampil, default 0 berarti tidak dihapus otomatis
      action?: { label: string; onClick: () => void };
    }
  ) => {
    addToast({
      id: options?.id,
      type: "loading",
      title,
      message,
      ...options,
    });
  },

  /**
   * Menampilkan notifikasi konfirmasi (Yes/No)
   * Mengembalikan Promise<boolean> true jika user klik "Ya"
   */
  confirm: (
    title: string,
    message?: string,
    options?: {
      id?: string;
      confirmLabel: string;
      cancelLabel: string;
    }
  ) => {
    return new Promise<boolean>((resolve) => {
      addToast({
        id: options?.id,
        type: "confirm",
        title,
        message,
        confirmAction: {
          confirmLabel: options?.confirmLabel ?? "Ya",
          cancelLabel: options?.cancelLabel ?? "Batal",
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        },
      });
    });
  },

  /**
   * Menghapus toast berdasarkan ID
   */
  removeToast: (id: string) => {
    removeToast(id);
  },
};
