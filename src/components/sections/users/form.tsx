"use client";

import { useUsersMutation } from "@/components/parts/manajemen-user/users/api";
import { useGetRoles } from "@/components/parts/roles/api";

import {
  UserPayload,
  UserValidation,
  UserValidationUpdate,
} from "@/components/parts/users/validation";
import { CustomFormDragAndDrop } from "@/components/shared/forms/customFormDragAndDrop";
import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { CustomFormRadioGroup } from "@/components/shared/forms/customFormRadioGroup";
import CustomFormSelectSearch from "@/components/shared/forms/customFormSelectSearch";
import { CustomFormTextArea } from "@/components/shared/forms/customFormTextArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { blobToUrl, revokeUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UsersForm({
  mode,
  defaultValues,
}: FormComponent<UserPayload>) {
  const onlyView = mode === "view";

  const { id } = useParams();
  const router = useRouter();
  const [profilePictureUrl, setProfileprofilePictureUrl] = useState<
    string | null
  >();

  const { data: _rolesData } = useGetRoles("limit=99999");
  const RolesData = _rolesData?.data.items.map((item) => ({
    label: item.name,
    value: String(item.id),
  }));

  const usersMutation = useUsersMutation(Number(id));

  const form = useForm<UserPayload>({
    resolver: zodResolver(
      mode === "create" ? UserValidation : UserValidationUpdate
    ),
  });
  const {
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const profilePicture = watch("profilePicture");

  const onSubmit = handleSubmit((value) => {
    console.log(value, "payload");
    usersMutation.mutate(
      { ...value, profilePicture: value.profilePicture?.[0] },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  });

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues, profilePicture: undefined });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (errors) {
      console.log(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (!profilePicture || profilePicture.length > 1) return;
    const url = blobToUrl(profilePicture[0]);
    setProfileprofilePictureUrl(url);

    // cleanup
    return () => {
      revokeUrl(url);
    };
  }, [profilePicture]);

  console.log(profilePictureUrl, "profilePictureUrl");

  return (
    <Card>
      <CardContent className="p-5">
        <h1 className="font-normal text-xl">Detail Informasi</h1>
        <form onSubmit={onSubmit}>
          <Form {...form}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex place-content-center md:place-content-start">
                <div className="">
                  <Avatar className="size-32 rounded-md">
                    <AvatarImage
                      src={
                        (profilePictureUrl
                          ? profilePictureUrl
                          : defaultValues?.profilePicture) ??
                        "https://github.com/shadcn.png"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                      {watch("name")}
                    </AvatarFallback>
                  </Avatar>
                  {!onlyView && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={"link"}>Pilih Gambar</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <CustomFormDragAndDrop<UserPayload>
                          name="profilePicture"
                          maxFiles={1}
                          acceptedFileTypes={[
                            "image/jpeg",
                            "image/jpg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                          ]}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              <CustomFormInput<UserPayload>
                name="name"
                label="Nama"
                placeholder="Nama"
                required
                disabled={onlyView}
              />
              <CustomFormRadioGroup<UserPayload>
                key={watch("gender")}
                name="gender"
                label="Jenis Kelamin"
                options={[
                  { label: "Laki-laki", value: "MALE" },
                  { label: "Perempuan", value: "FEMALE" },
                ]}
                required
                disabled={onlyView}
              />
              <CustomFormInput<UserPayload>
                name="position"
                label="Posisi"
                placeholder="Posisi"
                required
                disabled={onlyView}
              />
              <CustomFormInput<UserPayload>
                name="phone"
                label="Nomor Telepon"
                placeholder="Nomor Telepon"
                filterInput={inputFilters.numbersOnly}
                mask="62 ___-____-______"
                required
                disabled={onlyView}
              />
              <CustomFormTextArea<UserPayload>
                name="address"
                label="Alamat"
                placeholder="Alamat"
                className="md:col-span-2"
                required
                disabled={onlyView}
              />
              <CustomFormInput<UserPayload>
                name="nik"
                label="NIK"
                placeholder="NIK"
                required
                disabled={onlyView}
                maxLength={16}
                filterInput={inputFilters.numbersOnly}
              />
              <CustomFormInput<UserPayload>
                name="workUnit"
                label="Unit Kerja"
                placeholder="Unit Kerja"
                required
                disabled={onlyView}
              />
              <CustomFormSelectSearch<UserPayload>
                name="roleId"
                label="Role"
                placeholder="Role"
                options={RolesData ?? []}
                required
                disabled={onlyView}
              />
              <CustomFormInput<UserPayload>
                name="email"
                label="Email"
                placeholder="Email"
                filterInput={inputFilters.email}
                required
                disabled={onlyView || mode === "update"}
              />
              {mode === "create" && (
                <>
                  <CustomFormInput<UserPayload>
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    required
                  />
                  <CustomFormInput<UserPayload>
                    name="pin"
                    label="PIN"
                    placeholder="PIN"
                    type="password"
                    required
                    filterInput={inputFilters.numbersOnly}
                    maxLength={6}
                  />
                </>
              )}
            </div>
            <div className="flex gap-x-4 justify-end mt-6">
              {onlyView ? (
                <>
                  <Link href={`/users/update/${id}`}>
                    <Button
                      type="button"
                      variant={"outline"}
                      className="rounded-full min-w-32"
                    >
                      Edit
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="rounded-full min-w-32"
                    onClick={() => router.back()}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full min-w-32"
                    disabled={usersMutation.isPending}
                  >
                    {usersMutation.isPending ? (
                      <Loader className="animate-spin" />
                    ) : mode === "create" ? (
                      "Simpan"
                    ) : (
                      "Perbaharui"
                    )}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </form>
      </CardContent>
    </Card>
  );
}
