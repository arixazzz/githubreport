"use client";

import { useUserPasswordMutation } from "@/components/parts/users/api";
import {
  ChangePasswordPayload,
  ChangePasswordValidation,
} from "@/components/parts/users/validation";
import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdatePasswordAction() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const editPassword = searchParams.get("editPassword");
  const isEdit = Boolean(editPassword);

  const [open, setOpen] = useState(false);

  const form = useForm<ChangePasswordPayload>({
    resolver: zodResolver(ChangePasswordValidation),
  });
  const { reset, handleSubmit } = form;

  const usePasswordMutation = useUserPasswordMutation(Number(editPassword));

  // buka modal jika create / edit
  useEffect(() => {
    setOpen(isEdit);
  }, [isEdit]);

  const replaceWithParams = (nextParams: URLSearchParams) => {
    const q = nextParams.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const clearModalQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editPassword");
    replaceWithParams(params);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      clearModalQuery();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      if (isEdit) params.set("editPassword", editPassword!);
      replaceWithParams(params);
    }
  };

  const onSubmit = handleSubmit((data) => {
    usePasswordMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
        router.refresh?.();
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[40rem] overflow-y-auto max-w-xl">
        <DialogTitle className="font-semibold text-xl text-start">
          Update Password
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-y-4">
            <CustomFormInput<ChangePasswordPayload>
              name="newPassword"
              label="Masukan Kata Sandi Baru"
              placeholder="Masukan Kata Sandi Baru"
              type="password"
            />
            <CustomFormInput<ChangePasswordPayload>
              name="confirmPassword"
              label="Konfirmasi Kata Sandi Baru"
              placeholder="Konfirmasi Kata Sandi Baru"
              type="password"
            />
            <div className="flex gap-x-4 justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full min-w-32"
                >
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-full min-w-32">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
