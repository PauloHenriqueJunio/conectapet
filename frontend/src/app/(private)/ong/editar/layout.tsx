"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function EditarPetsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const isOng = user?.role === "ONG";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <SiteHeader
        page="dashboard-editar"
        variant={isOng ? "ong" : "pessoa-fisica"}
      />
      <main className="mx-auto w-full max-w-6xl px-6 py-10 flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
