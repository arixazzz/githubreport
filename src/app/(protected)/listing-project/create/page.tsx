"use client";

import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
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
  permissions: [""], // optional overide role jika ada permission
  roles: [""], // optional
};

export default function Page() {
  const router = useRouter();
  const form = useForm<any>({
    // resolver: zodResolver()// resolver,
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
            title: "Listing Project",
          },
          {
            title: "Listing Project",
            href: "/listing-project",
          },
          {
            title: "Tambah",
          },
        ]}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <TitleHeader title="Tambah Project" />
            <div className="mt-3 flex flex-col gap-3">
              <CustomFormInput<any>
                name="name"
                label="Nama"
                placeholder="Masukkan Nama Project"
              />
              <CustomFormTextArea<any>
                name="Detail"
                label="Detail Project"
                placeholder="Masukkan Detail Project"
              />
              <CustomFormInput<any>
                name="Developer Yang Ditugaskan"
                label="Developer Yang Ditugaskan"
                placeholder="Masukkan Nama Developer"
              />
              <CustomFormInput<any>
                name="Tanggal Deadline"
                label="Tanggal Deadline"
                placeholder="Masukkan Tanggal Deadline"
              />
              <CustomFormInput<any>
                name="URL GitHub"
                label="URL GitHub"
                placeholder="Masukkan URL GitHub"
              />
            </div>
            <div className="flex gap-x-4 justify-end mt-10">
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
        </form>
      </Form>
    </Card>
  );
}
