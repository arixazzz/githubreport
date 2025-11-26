"use client";

import { useLoginMutation } from "@/components/parts/login/api";
import {
  LoginPayload,
  loginValidation,
} from "@/components/parts/login/validation";
import { ensureWebPushSubscription } from "@/components/parts/webpush/api";
import ForgotPassword from "@/components/sections/login/forgotPassword";
import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import GitHubSignInButton from "@/components/shared/gitHubSignInButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useShowErrors from "@/hooks/useShowErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: { errors },
  } = form;
  useShowErrors(errors);

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginPayload) => {
    console.log("Login data:", data);
    loginMutation.mutate(data, {
      onSuccess: async (response) => {
        Cookie.set("accessToken", response.data.token);
        // Decode JWT token
        const decoded: decodedProps = jwtDecode(response.data.token);
        if (decoded.role.toLowerCase() === "user") {
          router.push("/profile");
        } else {
          router.push("/dashboard");
        }
        await ensureWebPushSubscription();
      },
    });
  };

  return (
    <main className="flex-1">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Login ke GitRepo Platform
            </p>
          </div>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <CustomFormInput<LoginPayload>
                    name="email"
                    label="Email"
                    placeholder="Login menggunakan Email"
                    required
                  />
                  <CustomFormInput<LoginPayload>
                    name="password"
                    label="Kata Sandi"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-3 mt-4">
                  Masuk
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Cara lain
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <GitHubSignInButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
