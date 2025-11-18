"use client";

import CustomFormRichEditor from "@/components/shared/forms/customFormRichEditor";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {
      mailAddress: "",
      phoneNumber: "",
      address: "",
      logo: undefined,
    },
  });

  const { watch } = form;

  const onSubmit = (data: any) => {};

  return (
    <div>
      <BreadcrumbSetItem
        items={[
          {
            title: "Dashboard",
            href: "/dashboard",
          },
          {
            title: "Surat",
          },
        ]}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-y-3"
        >
          <CustomFormRichEditor name="IsiSurat1" label="Kop Surat" />
          {/* <CustomFormRichEditor name="IsiSurat2" label="Isi Surat" />
          <CustomFormRichEditor name="IsiSurat3" label="Footer Surat" /> */}
        </form>
      </Form>
    </div>
  );
}
