"use client";

import { useToastStore } from "./toastStore";

/**
 * Hook untuk menggunakan sistem toast/notifikasi
 * Menyediakan fungsi toast dengan berbagai tipe (success, error, warning, info)
 */
export function useToast() {
  const { addToast } = useToastStore();

  const toast = {
    /**
     * Menampilkan notifikasi sukses
     */
    success: (
      title: string,
      message?: string,
      options?: {
        duration?: number;
        action?: { label: string; onClick: () => void };
      }
    ) => {
      addToast({
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
        duration?: number;
        action?: { label: string; onClick: () => void };
      }
    ) => {
      addToast({
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
        duration?: number;
        action?: { label: string; onClick: () => void };
      }
    ) => {
      addToast({
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
        duration?: number;
        action?: { label: string; onClick: () => void };
      }
    ) => {
      addToast({
        type: "info",
        title,
        message,
        ...options,
      });
    },
  };

  return { toast };
}
