"use client";

import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Button } from "@/components/ui/button";
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
    <div>
      <BreadcrumbSetItem
        items={[
          {
            title: "Produk",
            href: "/tables/admin",
          },
          {
            title: "Tambah",
          },
        ]}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Tambah Data</h1>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <CustomFormInput<any>
                name="name"
                label="Nama"
                placeholder="Masukkan Nama"
              />
              <CustomFormInput<any>
                name="email"
                label="Email"
                placeholder="Masukkan Nama"
                filterInput={inputFilters.email}
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
    </div>
  );
}
