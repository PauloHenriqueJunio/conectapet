"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  const isOng = useMemo(() => user?.role === "ONG", [user?.role]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600">
            Olá, {user?.name}. Perfil: {user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg bg-slate-800 px-4 py-2 text-white"
        >
          Sair
        </button>
      </header>

      {isOng && (
        <nav className="mb-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <ul className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
            <li>
              <Link
                href="/dashboard"
                className="inline-flex rounded-lg px-3 py-2 transition hover:bg-slate-100"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/cadastrar-pet"
                className="inline-flex rounded-lg px-3 py-2 transition hover:bg-slate-100"
              >
                CADASTRAR PET
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/editar"
                className="inline-flex rounded-lg px-3 py-2 transition hover:bg-slate-100"
              >
                EDITAR
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {children}
    </main>
  );
}
