"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader,
} from "lucide-react";
import { Toast, useToastStore } from "./toastStore";
import { Button } from "@/components/ui/button";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

// Mapping icon untuk setiap tipe notifikasi
const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader, // Loader icon untuk tipe loading
  confirm: Info, // Ganti sesuai preferensi untuk confirm
};

// Mapping warna untuk setiap tipe notifikasi
const colorMap = {
  success: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    text: "text-green-900 dark:text-green-100",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    text: "text-red-900 dark:text-red-100",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-400",
    text: "text-yellow-900 dark:text-yellow-100",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    text: "text-blue-900 dark:text-blue-100",
  },
  loading: {
    bg: "bg-gray-50 dark:bg-gray-950/20",
    border: "border-gray-200 dark:border-gray-800",
    icon: "text-gray-600 dark:text-gray-400",
    text: "text-gray-900 dark:text-gray-100",
  },
  confirm: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    border: "border-indigo-200 dark:border-indigo-800",
    icon: "text-indigo-600 dark:text-indigo-400",
    text: "text-indigo-900 dark:text-indigo-100",
  },
} as const;

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];
  const duration = toast.duration ?? 5000;

  /**
   * Effect untuk mengupdate progress bar secara real-time
   */
  useEffect(() => {
    if (duration <= 0 || toast.type === "loading") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, toast.type]);

  // Handle confirmation action
  const handleConfirm = () => {
    toast.confirmAction?.onConfirm();
    onRemove(toast.id!);
  };

  const handleCancel = () => {
    toast.confirmAction?.onCancel?.();
    onRemove(toast.id!);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        ${colors.bg} ${colors.border}
        shadow-lg shadow-black/5
        p-4 pr-12
      `}
    >
      {/* Progress bar */}
      {duration > 0 && toast.type !== "loading" && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      )}

      {/* Close button */}
      {toast.type !== "loading" && (
        <button
          onClick={() => onRemove(toast.id!)}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4 opacity-60" />
        </button>
      )}

      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${colors.text}`}>
            {toast.title}
          </h4>

          {toast.message && (
            <p className={`text-sm mt-1 opacity-80 ${colors.text}`}>
              {toast.message}
            </p>
          )}

          {toast.type === "confirm" && (
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirm}
                className="h-7 text-xs"
              >
                {toast.confirmAction?.confirmLabel}
              </Button>
              {toast.confirmAction?.cancelLabel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-7 text-xs"
                >
                  {toast.confirmAction?.cancelLabel}
                </Button>
              )}
            </div>
          )}

          {toast.type === "loading" && (
            <div className="flex justify-center mt-2">
              <Loader className="animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
