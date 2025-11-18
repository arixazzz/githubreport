"use client";

import { useRolesMutation } from "@/components/parts/roles/api";
import {
  RolesPayload,
  RolesValidation,
} from "@/components/parts/roles/validation";
import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormPermissionSection from "./formPermissionSection";

export default function RolesForm({
  mode,
  defaultValues,
}: FormComponent<RolesPayload>) {
  const { id } = useParams();
  const router = useRouter();

  const readOnly = mode === "view";

  const rolesMutation = useRolesMutation(Number(id));

  const form = useForm<RolesPayload>({
    resolver: zodResolver(RolesValidation),
    defaultValues: {
      permissions: [
        {
          permissionId: 1,
          canRead: true,
          canWrite: false,
          canUpdate: false,
          canDelete: false,
          canRestore: false,
        },
      ],
    },
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  if (errors) console.log(errors);

  const onSubmit = handleSubmit((data) => {
    console.log(data, "payload");
    rolesMutation.mutate(data, {
      onSuccess: () => {
        router.replace("/roles");
      },
    });
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, setValue]);

  return (
    <Card>
      <CardContent className="p-5">
        <h1 className="font-normal text-xl">Detail Informasi</h1>
        <form onSubmit={onSubmit}>
          <Form {...form}>
            <div className="grid grid-cols-1 gap-6">
              <CustomFormInput<RolesPayload>
                name="name"
                label="Nama Role"
                placeholder="Nama Role"
                required
                disabled={readOnly}
              />
              <p className="py-4 w-full border-b font-semibold text-text-800">
                Hak Akses
              </p>
              <FormPermissionSection readOnly={readOnly} />
            </div>
            {mode === "view" ? (
              <div className="flex gap-x-4 justify-end mt-6">
                <Link href={`/roles/update/${id}`}>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="rounded-full min-w-32"
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-x-4 justify-end mt-6">
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
                  disabled={rolesMutation.isPending}
                >
                  {rolesMutation.isPending ? (
                    <Loader className="animate-spin" />
                  ) : mode === "create" ? (
                    "Simpan"
                  ) : (
                    "Perbaharui"
                  )}
                </Button>
              </div>
            )}
          </Form>
        </form>
      </CardContent>
    </Card>
  );
}
