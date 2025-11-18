import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} NextCore. Hak Cipta Dilindungi.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Ketentuan
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Privasi
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
}
