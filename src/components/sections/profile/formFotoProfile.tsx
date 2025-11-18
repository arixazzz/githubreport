"use client";

import { useUserProfileMutation } from "@/components/parts/users/api";
import {
  UserProfilePayload,
  UserProfileValidation,
} from "@/components/parts/users/validation";
import { CustomFormDragAndDrop } from "@/components/shared/forms/customFormDragAndDrop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useProfile } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function FormFotoProfile() {
  const qc = useQueryClient();
  const { user } = useProfile();

  const [open, setOpen] = useState(false);

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

  const profilePicture = watch("profilePicture");

  if (errors) console.log(errors);

  const onSubmit = handleSubmit((data) => {
    const payload = { ...data, profilePicture: data.profilePicture[0] };
    console.log(payload, "payload");
    userProfileMutation.mutate(payload, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["useGetUserDetail"] });
        setOpen(false);
      },
    });
  });

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        gender: user.gender === "MALE" ? "MALE" : "FEMALE",
        profilePicture: undefined,
      });
    }
  }, [reset, user]);

  return (
    <div>
      <Avatar className="rounded-md size-20" onClick={() => setOpen(true)}>
        <AvatarImage
          src={user?.profilePicture ?? "https://github.com/shadcn.png"}
          className="object-cover"
        />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <Form {...form}>
              <div className="w-full flex flex-col gap-y-4">
                <CustomFormDragAndDrop<UserProfilePayload>
                  name="profilePicture"
                  acceptedFileTypes={[
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                  ]}
                />
                <Button
                  disabled={
                    profilePicture === undefined ||
                    profilePicture?.length === 0 ||
                    userProfileMutation.isPending
                  }
                  className="ml-auto rounded-full"
                >
                  Update Profile
                </Button>
              </div>
            </Form>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
