import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { formatErrorMessages } from "@/lib/utils";
import { toast } from "@/lib/myToast";
import { myAlert } from "@/lib/myAlert";
import { useId } from "react";

/**
 * Custom React Query mutation hook untuk form yang otomatis:
 * - Menampilkan loading dialog
 * - Menampilkan pesan sukses
 * - Menangani error validasi dari backend dan mengisi setError react-hook-form jika diberikan
 * - Bisa menyisipkan konfirmasi sebelum mutate (confirm modal)
 *
 * @template TData - Tipe data response dari mutation
 * @template TError - Tipe error dari mutation (biasanya any)
 * @template TVariables - Tipe payload yang dikirim
 * @template TForm - Tipe field form yang digunakan untuk setError
 */

type FormMutationOptions<
  TData,
  TError,
  TVariables,
  TForm extends FieldValues,
> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "mutationFn" | "networkMode"
> & {
  mutationFn: (variables: TVariables) => Promise<TData>;
  messageMode?: "toast" | "dialog"; // Menambahkan pilihan mode "toast" atau "dialog"
  loadingMessage?: string;
  successMessage?: string;
  confirmMessage?: {
    title: string;
    description?: string;
  };
  setError?: UseFormSetError<TForm>; // Optional setError dari form
};

export function useFormMutation<
  TData,
  TError = any,
  TVariables = void,
  TForm extends FieldValues = FieldValues,
>(
  options: FormMutationOptions<TData, TError, TVariables, TForm>
): UseMutationResult<TData, TError, TVariables> {
  const {
    mutationFn,
    loadingMessage,
    successMessage,
    confirmMessage,
    setError,
    messageMode = "dialog", // Default messageMode adalah "dialog"
    ...restOptions
  } = options;
  const uniqueId = useId();
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      // Menampilkan konfirmasi jika ada
      if (confirmMessage) {
        const confirmed = await myAlert.confirm(
          confirmMessage.title,
          confirmMessage.description
        );
        if (!confirmed) throw new Error("Action cancelled by user");
      }

      if (messageMode === "toast") {
        toast.loading(loadingMessage || "Memproses...", undefined, {
          id: uniqueId,
        });
        console.log(uniqueId, "Awal");
      } else {
        myAlert.loading(loadingMessage || "Memproses...");
      }

      // Melakukan mutation
      const result = await mutationFn(variables);
      return result;
    },
    onSuccess: (data, variables, context) => {
      // Menampilkan toast atau dialog success
      if (messageMode === "dialog") {
        myAlert.success(
          "Berhasil",
          successMessage ?? "Berhasil Melakukan Operasi"
        );
        setTimeout(() => {
          myAlert.done();
        }, 3000);
      } else {
        toast.success(
          "Berhasil",
          successMessage ?? "Berhasil Melakukan Operasi"
        );
      }

      // Eksekusi callback onSuccess
      restOptions.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const rawData = error?.data || {};

      // Menampilkan pesan error dengan toast atau dialog
      if (messageMode === "dialog") {
        myAlert.error(error?.message || "Error", formatErrorMessages(rawData));
      } else {
        toast.error("Error", error?.message || "Error");
      }

      // Eksekusi validasi form hanya jika setError tersedia
      if (setError) {
        Object.entries(rawData).forEach(([field, error]) => {
          if (!error) return;
          const message = Array.isArray(error)
            ? error[0]
            : typeof error === "object" &&
                "_errors" in error &&
                Array.isArray(error._errors)
              ? error._errors[0]
              : "Invalid";

          setError(field as Path<TForm>, {
            type: "server",
            message,
          });
        });
      }

      // Eksekusi callback onError
      restOptions.onError?.(error, variables, context);
    },
    onSettled: (...rest) => {
      // Hapus toast loading setelah mutation selesai
      toast.removeToast(uniqueId); // Menghapus toast loading jika selesai
      console.log(uniqueId, "Akhir");
      restOptions.onSettled?.(...rest);
    },
    networkMode: "offlineFirst",
    ...restOptions,
  });
}
