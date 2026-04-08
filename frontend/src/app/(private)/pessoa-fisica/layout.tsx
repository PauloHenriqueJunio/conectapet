import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PessoaFisicaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SiteHeader page="quero-adotar" variant="pessoa-fisica" />
      <div className="flex min-h-screen flex-col bg-slate-50">
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {children}
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
