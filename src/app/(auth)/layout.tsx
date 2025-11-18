import { SiteFooter } from "@/components/shared/siteFooter";
import { SiteHeader } from "@/components/shared/siteHeader";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
