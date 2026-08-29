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
  onDeleteAccountClick: () => void;
  setIsUserDropdownOpen: Dispatch<SetStateAction<boolean>>;
  userDropdownRef: RefObject<HTMLDivElement | null>;
}

export function DesktopUserActions({
  displayName,
  editProfileHref,
  isAuthenticated,
  isUserDropdownOpen,
  logout,
  onDeleteAccountClick,
  setIsUserDropdownOpen,
  userDropdownRef,
}: DesktopUserActionsProps) {
  if (!isAuthenticated) {
    return (
      <div
        className="flex items-center gap-3 pl-4"
        style={{ borderLeft: "1px solid var(--border-default)" }}
      >
        <ThemeToggle />
        <Link
          href="/login"
          className="rounded-lg border px-4 py-2 text-sm font-bold transition"
          style={{
            borderColor: "var(--brand)",
            color: "var(--brand-text)",
            backgroundColor: "transparent",
          }}
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="rounded-lg px-4 py-2 text-sm font-bold transition shadow-sm"
          style={{
            backgroundColor: "var(--brand)",
            color: "var(--text-inverse)",
          }}
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 pl-4"
      style={{ borderLeft: "1px solid var(--border-default)" }}
    >
      <ThemeToggle />

      <span
        className="text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        Olá, {displayName?.split(" ")[0]}
      </span>

      <div className="relative" ref={userDropdownRef}>
        <button
          type="button"
          onClick={() => setIsUserDropdownOpen((prev) => !prev)}
          className="rounded-lg p-2 transition"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Abrir menu do perfil"
          aria-expanded={isUserDropdownOpen}
        >
          <Settings
            size={21}
            className={`transition-transform duration-300 ${isUserDropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <div
          className={`absolute right-0 top-12 z-50 w-44 origin-top-right rounded-xl p-1 shadow-lg transition-all duration-200 ${
            isUserDropdownOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
          style={{
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <Link
            href={editProfileHref}
            onClick={() => setIsUserDropdownOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--text-primary)" }}
          >
            Editar Perfil
          </Link>
          <button
            type="button"
            onClick={onDeleteAccountClick}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100 text-sm font-medium transition"
            style={{ color: "var(--status-danger-text)" }}
          >
            Excluir conta
          </button>
        </div>
      </div>

      <button
        onClick={logout}
        className="rounded-lg px-4 py-2 text-sm font-semibold transition shadow-sm"
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
        }}
      >
        Sair
      </button>
    </div>
  );
}
