// "use client";

// import { useLoginMutation } from "@/components/parts/login/api";
// import {
//   LoginPayload,
//   loginValidation,
// } from "@/components/parts/login/validation";
// import { CustomFormInput } from "@/components/shared/forms/customFormInput";
// import { GitHubSignInButton } from "@/components/shared/gitHubSignInButton";

// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import useShowErrors from "@/hooks/useShowErrors";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";

// export default function LoginPage() {
//   const router = useRouter();
//   const form = useForm<LoginPayload>({
//     resolver: zodResolver(loginValidation),
//     defaultValues: {
//       username: "",
//       password: "",
//     },
//   });
//   const {
//     formState: { errors },
//   } = form;
//   useShowErrors(errors);

//   const loginMutation = useLoginMutation();

//   const onSubmit = async (data: LoginPayload) => {
//     console.log("Login data:", data);
//     const response = await fetch("/api/auth", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await response.json();

//     if (result.status === 400) {
//       alert(result.error);
//     }

//     if (result.status === 200) {
//       alert(result.error);
//       router.push("/dashboard");
//     }
//   };

//   return (
//     <main className="flex-1">
//       <div className="container flex h-screen w-screen flex-col items-center justify-center">
//         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//           <div className="flex flex-col space-y-2 text-center">
//             <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
//             <p className="text-sm text-muted-foreground">
//               Login ke GitRepo Platform
//             </p>
//           </div>
//           <div className="grid gap-6">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)}>
//                 <div className="grid gap-4">
//                   <CustomFormInput<LoginPayload>
//                     name="username"
//                     label="Username Github"
//                     placeholder="Login menggunakan Username Github"
//                     required
//                   />
//                   <CustomFormInput<LoginPayload>
//                     name="password"
//                     label="Kata Sandi"
//                     placeholder="••••••••"
//                     type="password"
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full py-3 mt-4">
//                   Masuk
//                 </Button>
//               </form>
//             </Form>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">
//                   Daftar
//                 </span>
//               </div>
//             </div>
//             <div className="grid gap-2">
//               <GitHubSignInButton />
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import {
  LoginPayload,
  loginValidation,
} from "@/components/parts/login/validation";
import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import { GitHubSignInButton } from "@/components/shared/gitHubSignInButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useShowErrors from "@/hooks/useShowErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  useShowErrors(errors);

  const onSubmit = async (data: LoginPayload) => {
    try {
      setLoading(true);

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login gagal");
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="text-sm text-muted-foreground">
              Login ke GitHub Report Dini
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <CustomFormInput<LoginPayload>
                  name="username"
                  label="Username GitHub"
                  placeholder="username github"
                  required
                />
                <CustomFormInput<LoginPayload>
                  name="password"
                  label="Kata Sandi"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Atau
              </span>
            </div>
          </div>

          <GitHubSignInButton />
        </div>
      </div>
    </main>
  );
}
