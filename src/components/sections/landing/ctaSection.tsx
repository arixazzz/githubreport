import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      id="pricing"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Siap Memulai Proyek Anda?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Daftar sekarang dan mulai membangun aplikasi web modern dengan
              NextCore.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full min-[400px]:w-auto">
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full min-[400px]:w-auto"
              >
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
