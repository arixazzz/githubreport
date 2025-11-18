"use client";

import { useRegisterMutation } from "@/components/parts/register/api";
import {
  RegisterPayload,
  registerValidation,
} from "@/components/parts/register/validation";
import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import GoogleSignInButton from "@/components/shared/googleSignInButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useShowErrors from "@/hooks/useShowErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerValidation),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;
  useShowErrors(errors);

  const registerMutation = useRegisterMutation();

  const onSubmit = (data: RegisterPayload) => {
    console.log("Login data:", data);
    registerMutation.mutate(data, {
      onSuccess: (response) => {
        router.push("/login");
      },
    });
  };

  return (
    <main className="flex-1">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Registrasi
            </h1>
            <p className="text-sm text-muted-foreground">silahkan registrasi</p>
          </div>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <CustomFormInput<RegisterPayload>
                    name="name"
                    label={"nama"}
                    placeholder={"nama"}
                    required
                  />
                  <CustomFormInput<RegisterPayload>
                    name="email"
                    label={"email"}
                    placeholder={"email"}
                    filterInput={inputFilters.email}
                    required
                  />
                  <CustomFormInput<RegisterPayload>
                    name="password"
                    label={"password"}
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                  <CustomFormInput<RegisterPayload>
                    name="confirmPassword"
                    label={"tulis ulang password"}
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                  <Button type="submit">Daftar</Button>
                </div>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Masuk
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <GoogleSignInButton />
            </div>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Udah punya akun?
            <Link
              href="/login"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
