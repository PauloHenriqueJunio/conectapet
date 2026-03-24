"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/layout/SiteHeader";

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
    <main className="mx-auto max-w-6xl px-6 py-10">
      {isOng ? (
        <SiteHeader page={ongHeaderPage} variant="ong" />
      ) : (
        <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600">
            Olá, {user?.name}. Perfil: {user?.role}
          </p>
        </header>
      )}

      {children}
    </main>
  );
}
