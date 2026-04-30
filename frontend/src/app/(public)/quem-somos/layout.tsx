import { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function QuemSomosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader page="quem-somos" variant="public" />

      <main className="flex-1">{children}</main>

      <SiteFooter className="mt-0 rounded-none border-x-0 border-b-0" />
    </div>
  );
}
