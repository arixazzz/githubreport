import { useForgoutMutation } from "@/components/parts/login/api";
import {
  ForgoutPasswordPayload,
  forgoutPasswordValidation,
} from "@/components/parts/login/validation";
import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookie from "js-cookie";

export default function ForgotPassword() {
  const router = useRouter();
  const form = useForm<ForgoutPasswordPayload>({
    resolver: zodResolver(forgoutPasswordValidation),
  });

  const forgoutMutation = useForgoutMutation();

  const onSubmit = (data: ForgoutPasswordPayload) => {
    forgoutMutation.mutate(data, {
      onSuccess: () => {
        Cookie.set("reset-password-mail", form.watch("email") as string);
        router.replace("reset/otp");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="mt-0 ml-auto">
          Lupa Kata Sandi?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[40rem] overflow-y-scroll">
        <DialogTitle className="">
          <figure className="w-fit flex items-center">
            <div className="bg-white rounded-full w-16 h-16 aspect-square object-contain p-2 overflow-hidden">
              <Image
                src={"/assets/icons/logo.png"}
                width={90}
                height={90}
                alt="login-office"
                className="w-full h-full"
              />
            </div>
            <figcaption className="w-1/2 text-sm text-text-700 ml-4">
              Sistem Informasi Manajemen Github Report
            </figcaption>
          </figure>
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-2">
              <p className="font-semibold">Lupa Kata Sandi?</p>
              <p className="text-sm">
                Masukkan email Anda dan kami akan mengirimkan tautan untuk
                mengatur ulang kata sandi.
              </p>
              <CustomFormInput<ForgoutPasswordPayload>
                name="email"
                label="Email"
                placeholder="Masukan Email"
                filterInput={inputFilters.email}
                className="my-5"
              />
              <Button type="submit" className="rounded-full mx-auto w-36">
                Kirim
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
