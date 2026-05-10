"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";

interface MobileUserActionsProps {
  closeMobileMenu: () => void;
  displayName?: string;
  editProfileHref: string;
  isAuthenticated: boolean;
  isUserDropdownOpen: boolean;
  logout: () => void;
  setIsUserDropdownOpen: Dispatch<SetStateAction<boolean>>;
  userDropdownRef: RefObject<HTMLDivElement | null>;
}

export function MobileUserActions({
  closeMobileMenu,
  displayName,
  editProfileHref,
  isAuthenticated,
  isUserDropdownOpen,
  logout,
  setIsUserDropdownOpen,
  userDropdownRef,
}: MobileUserActionsProps) {
  if (!isAuthenticated) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/login"
          className="rounded-lg border-2 border-brand-100 bg-brand-50 px-3 py-3 text-center font-bold text-brand-700 transition-colors hover:bg-brand-100"
          onClick={closeMobileMenu}
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-brand-600 px-3 py-3 text-center font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
          onClick={closeMobileMenu}
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" ref={userDropdownRef}>
      <div className="flex items-center justify-between px-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {`LOGADO COMO ${displayName?.split(" ")[0]?.toUpperCase() ?? "USUÁRIO"}`}
        </span>
        <button
          type="button"
          onClick={() => setIsUserDropdownOpen((prev) => !prev)}
          className="rounded-lg p-1 text-slate-600 transition hover:text-slate-900"
          aria-label="Abrir menu do perfil"
          aria-expanded={isUserDropdownOpen}
        >
          <Settings
            size={16}
            className={`transition-transform duration-300 ${isUserDropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </div>
      {isUserDropdownOpen && (
        <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
          <Link
            href={editProfileHref}
            onClick={() => {
              setIsUserDropdownOpen(false);
              closeMobileMenu();
            }}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Editar Perfil
          </Link>
          <button
            type="button"
            className="block rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500"
          >
            Excluir conta
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className="block rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}
