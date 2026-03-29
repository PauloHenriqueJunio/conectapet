import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <SiteHeader page="quero-adotar" variant="pessoa-fisica" />

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}
