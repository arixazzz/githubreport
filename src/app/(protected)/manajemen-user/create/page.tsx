"use client";

import CustomFormCheckbox from "@/components/shared/forms/customFormCheckbox";
import { CustomFormDragAndDrop } from "@/components/shared/forms/customFormDragAndDrop";
import CustomFormFileInput from "@/components/shared/forms/customFormFileInput";
import CustomFormGmaps from "@/components/shared/forms/customFormGmaps";
import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { CustomFormMultiSelect } from "@/components/shared/forms/customFormMultipleSelect";
import { CustomFormRadioGroup } from "@/components/shared/forms/customFormRadioGroup";
import { CustomFormSelect } from "@/components/shared/forms/customFormSelect";
import CustomFormSelectSearch from "@/components/shared/forms/customFormSelectSearch";
import { CustomFormTextArea } from "@/components/shared/forms/customFormTextArea";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const access: AccessRule = {
  permissions: [""], // optional override role jika ada permission
  roles: [""], // optional
};

export default function Page() {
  const router = useRouter();
  const form = useForm<any>({
    // resolver: zodResolver() // resolver,
    defaultValues: {},
  });

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <Card>
      <BreadcrumbSetItem
        items={[
          {
            title: "Manajemen User",
          },
          {
            title: "Manajemen User",
            href: "/manajemen-user",
          },
          {
            title: "Tambah User",
          },
        ]}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <TitleHeader title="Tambah Pengguna" />
            <div className="mt-3 flex flex-col gap-3">
              <CustomFormInput<any>
                name="name"
                label="Nama"
                placeholder="Masukkan Nama User"
              />
              <CustomFormInput<any>
                name="email"
                label="Email"
                placeholder="Masukkan Email"
              />

              <CustomFormMultiSelect
                label="Posisi"
                name="try"
                options={[
                  { label: "FrontEnd Developer", value: "FrontEnd Developer" },
                  { label: "BackEnd Developer", value: "BackEnd Developer" },
                ]}
              />

              <CustomFormInput<any>
                name="githubUsername"
                label="GitHub Username"
                placeholder="Masukkan Username GitHub"
              />
              <CustomFormInput<any>
                name="password"
                label="Password"
                placeholder="Masukkan Password"
                type="password"
              />

              <div className="mt-4 flex gap-4">
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
                  disabled={false}
                >
                  {false ? <Loader className="animate-spin" /> : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
}
