import Link from "next/link";
import { FlaskConical, Github, ArrowLeft } from "lucide-react";

export default function ModelTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen ">
      <header>
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Dashboard
        </Link>
      </header>

      <main>{children}</main>
    </div>
  );
}
