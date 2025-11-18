"use client";

import { useUserProfileMutation } from "@/components/parts/users/api";
import {
  UserPayload,
  UserProfilePayload,
  UserProfileValidation,
} from "@/components/parts/users/validation";
import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { CustomFormSelect } from "@/components/shared/forms/customFormSelect";
import TextLabel from "@/components/shared/valueLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormProfileStore } from "@/store/formProfileStore";
import { useProfile } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function FormProfile() {
  const qc = useQueryClient();
  const { edit, closeEdit } = FormProfileStore();
  const { user } = useProfile();

  const userProfileMutation = useUserProfileMutation();

  const form = useForm<UserProfilePayload>({
    resolver: zodResolver(UserProfileValidation),
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  if (errors) console.log(errors);

  const onSubmit = handleSubmit((data) => {
    userProfileMutation.mutate(data, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["useGetUserDetail"] });
        closeEdit();
      },
    });
  });

  useEffect(() => {
    if (user) {
      reset({ ...user, gender: user.gender === "MALE" ? "MALE" : "FEMALE" });
    }
  }, [reset, user]);

  return (
    <div className="flex flex-col my-5 duration-300">
      {edit ? (
        <form onSubmit={onSubmit}>
          <Form {...form}>
            <div className="grid grid-cols-2 gap-5 gap-y-8">
              <CustomFormInput<UserPayload>
                name="name"
                label="Nama"
                placeholder="Nama"
              />
              <CustomFormInput<UserPayload>
                name="nik"
                label="NIK"
                placeholder="NIK"
                maxLength={18}
                filterInput={inputFilters.numbersOnly}
              />
              <CustomFormSelect<UserPayload>
                name="gender"
                key={watch("gender")}
                label="Jenis Kelamin"
                placeholder="Jenis Kelamin"
                options={[
                  { label: "Laki-Laki", value: "MALE" },
                  { label: "Perempuan", value: "FEMALE" },
                ]}
              />
              <CustomFormInput<UserPayload>
                name="position"
                label="Jabatan"
                placeholder="Jabatan"
              />
              <CustomFormInput<UserPayload>
                name="workUnit"
                label="Unit Kerja"
                placeholder="Unit Kerja"
              />
              <CustomFormInput<UserPayload>
                name="email"
                label="Email"
                placeholder="Email"
                filterInput={inputFilters.email}
                disabled
              />
              <CustomFormInput<UserPayload>
                name="phone"
                label="Nomor Telepon"
                placeholder="Nomor Telepon"
                mask="+62 ___-____-_____"
              />
              <CustomFormInput<UserPayload>
                name="address"
                label="Alamat"
                placeholder="Alamat"
              />

              <Button className="col-span-2 rounded-full min-w-32 ml-auto">
                Simpan
              </Button>
            </div>
          </Form>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          <TextLabel label="Nama" value={user?.name} />
          <TextLabel label="NIK" value={user?.nik} />
          <TextLabel
            label="Jenis Kelamin"
            value={user?.gender === "MALE" ? "Laki-laki" : "Perempuan"}
          />
          <TextLabel label="Jabatan" value={user?.position} />
          <TextLabel label="Unit Kerja" value={user?.workUnit} />
          <TextLabel label="Email" value={user?.email} />
          <TextLabel label="Nomor Telepon" value={user?.phone} />
          <TextLabel label="Alamat" value={user?.address} />
        </div>
      )}
    </div>
  );
}
