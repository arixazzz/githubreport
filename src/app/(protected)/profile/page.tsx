"use client";

import FormFotoProfile from "@/components/sections/profile/formFotoProfile";
import FormProfile from "@/components/sections/profile/formProfile";
import UpdatePassword from "@/components/sections/profile/updatePassword";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormProfileStore } from "@/store/formProfileStore";
import { useProfile } from "@/store/userStore";
import { Edit, X } from "lucide-react";

export default function Page() {
  const { edit, closeEdit, openEdit } = FormProfileStore();
  const { user } = useProfile();

  const handleChangeEdit = () => {
    if (edit) {
      closeEdit();
    } else {
      openEdit();
    }
  };
  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Profile",
          },
        ]}
      />
      <Card className="mt-5">
        <CardHeader className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-row gap-x-6">
            <FormFotoProfile />
            <div className="text-start text-sm grid justify-between w-full">
              <p className="font-semibold text-2xl ">{user?.name}</p>
              <p className="">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-x-3 ml-auto">
            <Button
              onClick={handleChangeEdit}
              className="rounded-full min-w-24 gap-x-3"
            >
              {edit ? (
                <>
                  <X />
                  Batal Edit
                </>
              ) : (
                <>
                  <Edit />
                  Eidt
                </>
              )}
            </Button>
            <UpdatePassword />
          </div>
        </CardHeader>
        <Separator className="mx-6 w-auto" />
        <CardContent className="mt-5">
          <p className="text-xl">Detail Informasi</p>
          <FormProfile />
        </CardContent>
      </Card>
    </main>
  );
}
