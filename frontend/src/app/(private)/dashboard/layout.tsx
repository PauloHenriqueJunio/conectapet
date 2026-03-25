"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isOng = useMemo(() => user?.role === "ONG", [user?.role]);

  const ongHeaderPage = useMemo(() => {
    if (pathname === "/dashboard/cadastrar-pet") {
      return "dashboard-cadastrar-pet" as const;
    }

    if (pathname === "/dashboard/editar") {
      return "dashboard-editar" as const;
    }

    return "dashboard-home" as const;
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <main className="mx-auto w-full max-w-6xl px-6 py-10 flex-1">
        {isOng ? (
          <SiteHeader page={ongHeaderPage} variant="ong" />
        ) : (
          <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Olá,{" "}
              <span className="font-semibold text-slate-700">{user?.name}</span>
              . Perfil:{" "}
              <span className="font-semibold text-slate-700">{user?.role}</span>
            </p>
          </header>
        )}

        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
