import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden"
      id="hero"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Lorem ipsum dolor sit amet consectetur
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Coba
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full min-[400px]:w-auto"
                >
                  Sekarang
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/50 opacity-20 blur-3xl"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-background p-4 shadow-xl">
                <div className="space-y-2 text-center">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    NextCore Template
                  </div>
                  <h2 className="text-2xl font-bold">Modern & Responsif</h2>
                  <p className="text-muted-foreground">
                    Dibangun dengan Next.js dan shadcn/ui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
