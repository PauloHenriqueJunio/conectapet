import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function MeusPetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SiteHeader page="meus-pets" variant="pessoa-fisica" />
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <main className="flex-1 px-6 py-10">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}