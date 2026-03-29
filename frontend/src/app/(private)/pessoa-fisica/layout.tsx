import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PessoaFisicaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <SiteHeader page="quero-adotar" variant="pessoa-fisica" />
      <div className="flex min-h-screen flex-col bg-slate-50">
        <main className="flex-1">{children}</main>

        <SiteFooter />
      </div>
    </body>
  );
}
