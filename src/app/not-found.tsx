"use client";

import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="h-screen grid place-items-center text-center px-8">
      <div className="w-full">
        <Construction className="w-20 h-20 mx-auto" />
        <p className="mt-10 !text-3xl !leading-snug md:!text-4xl">
          Kesalahan 404 <br /> Sepertinya ada yang salah.
        </p>
        <p className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-xl">
          Jangan khawatir kamu mungkin salah menuju halaman, atau halaman yang
          kamu tuju sedang tidak tersedia.
        </p>
        <Button
          color="gray"
          className="w-full px-4 md:w-[8rem]"
          onClick={() => router.back()}
        >
          Kembali
        </Button>
      </div>
    </div>
  );
}
