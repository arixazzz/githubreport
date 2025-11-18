import { ModeToggle } from "@/components/sections/landing/modeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/#hero" className="flex items-center space-x-2">
            <span className="inline-block font-bold">NextCore</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/#features"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Fitur
            </Link>
            <Link
              href="/#testimonials"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimoni
            </Link>
            <Link
              href="/#pricing"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Harga
            </Link>
            <Link
              href="/#guide"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Panduan
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
