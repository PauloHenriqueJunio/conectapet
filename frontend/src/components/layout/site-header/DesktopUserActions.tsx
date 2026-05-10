"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface DesktopUserActionsProps {
  displayName?: string;
  editProfileHref: string;
  isAuthenticated: boolean;
  isUserDropdownOpen: boolean;
  logout: () => void;
  setIsUserDropdownOpen: Dispatch<SetStateAction<boolean>>;
  userDropdownRef: RefObject<HTMLDivElement | null>;
}

export function DesktopUserActions({
  displayName,
  editProfileHref,
  isAuthenticated,
  isUserDropdownOpen,
  logout,
  setIsUserDropdownOpen,
  userDropdownRef,
}: DesktopUserActionsProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
        <Link
          href="/login"
          className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 shadow-sm"
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
      <ThemeToggle />

      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Olá, {displayName?.split(" ")[0]}
      </span>

      <div className="relative" ref={userDropdownRef}>
        <button
          type="button"
          onClick={() => setIsUserDropdownOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          aria-label="Abrir menu do perfil"
          aria-expanded={isUserDropdownOpen}
        >
          <Settings
            size={21}
            className={`transition-transform duration-300 ${isUserDropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <div
          className={`absolute right-0 top-12 z-50 w-44 origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-lg transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
            isUserDropdownOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
        >
          <Link
            href={editProfileHref}
            onClick={() => setIsUserDropdownOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Editar Perfil
          </Link>
          <button
            type="button"
            className="block w-full cursor-default rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            Excluir conta
          </button>
        </div>
      </div>

      <button
        onClick={logout}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 shadow-sm"
      >
        Sair
      </button>
    </div>
  );
}
