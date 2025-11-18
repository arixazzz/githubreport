"use client";

import { useUserPasswordMutation } from "@/components/parts/users/api";
import {
  ChangePasswordUserPayload,
  ChangePasswordUserValidation,
} from "@/components/parts/users/validation";
import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/useMobile";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookie from "js-cookie";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdatePassword() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const usePasswordMutation = useUserPasswordMutation();

  const form = useForm<ChangePasswordUserPayload>({
    resolver: zodResolver(ChangePasswordUserValidation),
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((data) => {
    usePasswordMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.data.token) {
          Cookie.set("accessToken", response.data.token);
        }
        setOpen(false);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full text-primary">
          {isMobile ? <LockKeyhole /> : "  Ubah Kata Sandi"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[40rem] overflow-y-scroll">
        <DialogTitle className="font-semibold text-xl text-start">
          Ubah Kata Sandi
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <Form {...form}>
            <div className="grid grid-cols-1 gap-y-6">
              <CustomFormInput<ChangePasswordUserPayload>
                name="oldPassword"
                label="Masukan Kata Sandi Lama"
                placeholder="Masukan Kata Sandi Lama"
                type="password"
              />
              <CustomFormInput<ChangePasswordUserPayload>
                name="newPassword"
                label="Masukan Kata Sandi Baru"
                placeholder="Masukan Kata Sandi Baru"
                type="password"
              />
              <CustomFormInput<ChangePasswordUserPayload>
                name="confirmPassword"
                label="Konfirmasi Kata Sandi Baru"
                placeholder="Konfirmasi Kata Sandi Baru"
                type="password"
              />
              <div className="flex gap-x-4 justify-end items-center">
                <DialogClose asChild>
                  <Button
                    className="rounded-full w-40"
                    type="button"
                    variant={"outline"}
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  className="rounded-full w-40"
                  disabled={usePasswordMutation.isPending}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
}
