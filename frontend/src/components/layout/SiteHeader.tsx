"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  COLOR_COMBINATIONS,
  NEUTRAL_COLORS,
  BRAND_COLORS,
  combineClasses,
  TRANSITIONS,
  Z_INDEX,
} from "@/constants/theme";

type HeaderVariant = "public" | "ong" | "pessoa-fisica";

type HeaderPage =
  | "home"
  | "ongs"
  | "quem-somos"
  | "quero-adotar"
  | "colocar-na-adocao"
  | "dashboard-home"
  | "dashboard-cadastrar-pet"
  | "dashboard-editar"
  | "minhas-solicitacoes"
  | "editar-perfil"
  | "pet-profile";

type HeaderNavKey = HeaderPage; // Simplifiquei para usar as mesmas chaves

interface SiteHeaderProps {
  page: HeaderPage;
  variant?: HeaderVariant;
}

export function SiteHeader({ page, variant = "public" }: SiteHeaderProps) {
  const { logout, isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  const [activeNav, setActiveNav] = useState<HeaderNavKey>(page);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navClass = (key: HeaderNavKey) =>
    `rounded-md px-2 py-1 transition ${
      activeNav === key
        ? "bg-brand-100 text-brand-800 font-bold"
        : "text-slate-700 hover:text-brand-700 font-medium"
    }`;

  const closeMobileMenu = () => setIsMenuOpen(false);

  const getEditProfileLink = () => {
    if (variant === "ong" || user?.role === "ONG") return "/ong/editar-perfil";
    return "/pessoa-fisica/editar-perfil";
  };

  // Define para onde o clique no Logo vai levar, dependendo de quem está logado
  const getLogoLink = () => {
    if (variant === "ong") return "/ong/dashboard";
    if (variant === "pessoa-fisica") return "/pessoa-fisica/home";
    return "/";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/50 bg-gradient-to-r from-white/95 via-white/90 to-brand-50/85 px-5 shadow-sm backdrop-blur-xl transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <nav className="flex items-center justify-between gap-4">
        {/* LOGO */}
        <div className="flex items-center">
          <Link
            href={getLogoLink()}
            className="text-xl font-extrabold tracking-tight text-brand-800"
          >
            Conecta<span className="text-slate-900">Pet</span>
          </Link>
        </div>

        {/* BOTÃO MOBILE */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>

        {/* MENUS DESKTOP */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex flex-wrap items-center gap-5 text-sm">
            {/* MUNDO 1: PÚBLICO (VISITANTES) */}
            {variant === "public" && (
              <>
                <li>
                  <Link href="/home" className={navClass("home")}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/ongs" className={navClass("ongs")}>
                    Verificar ONGs
                  </Link>
                </li>
                <li>
                  <Link href="/quem-somos" className={navClass("quem-somos")}>
                    Quem somos?
                  </Link>
                </li>
              </>
            )}

            {/* MUNDO 2: PESSOA FÍSICA LOGADA */}
            {variant === "pessoa-fisica" && (
              <>
                <li>
                  <Link
                    href="/pessoa-fisica/home"
                    className={navClass("quero-adotar")}
                  >
                    Quero adotar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pessoa-fisica/cadastrar-pet"
                    className={navClass("colocar-na-adocao")}
                  >
                    Colocar na adoção
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pessoa-fisica/#"
                    className={navClass("minhas-solicitacoes")}
                  >
                    Minha solicitações
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pessoa-fisica/editar-perfil"
                    className={navClass("editar-perfil")}
                  >
                    Editar Perfil
                  </Link>
                </li>
              </>
            )}

            {/* MUNDO 3: ONG LOGADA */}
            {variant === "ong" && (
              <>
                <li>
                  <Link
                    href="/ong/dashboard"
                    className={navClass("dashboard-home")}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ong/cadastrar-pet"
                    className={navClass("dashboard-cadastrar-pet")}
                  >
                    Cadastrar Pet
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ong/editar"
                    className={navClass("dashboard-editar")}
                  >
                    Editar Pets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ong/editar-perfil"
                    className={navClass("editar-perfil")}
                  >
                    Editar Perfil
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* BOTÕES DE AÇÃO (DIREITA) */}
          {isAuthenticated ? (
            // Usuário LOGADO: Mostra o nome e o botão de Sair em qualquer página
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                Olá, {user?.name?.split(" ")[0]}
              </span>

              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Abrir menu do perfil"
                >
                  <Settings size={21} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    <Link
                      href={getEditProfileLink()}
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar Perfil
                    </Link>
                    <button
                      type="button"
                      className="block w-full cursor-default rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500"
                    >
                      Excluir conta
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 shadow-sm"
              >
                Sair
              </button>
            </div>
          ) : (
            // Usuário DESLOGADO: Mostra os botões de Entrar/Criar Conta sempre
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
          )}
        </div>
      </nav>

      {/* MENU MOBILE */}
      <div
        className={`grid overflow-hidden transition-all duration-300 md:hidden ${isMenuOpen ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0">
          <ul className="space-y-2 border-t border-slate-200 pt-3 text-sm font-medium text-slate-700">
            {/* LINKS PÚBLICOS */}
            <li>
              <Link
                href="/"
                className="block rounded-lg px-3 py-2 hover:bg-brand-50"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/ongs"
                className="block rounded-lg px-3 py-2 hover:bg-brand-50"
                onClick={closeMobileMenu}
              >
                Verificar ONGs
              </Link>
            </li>
            <li>
              <Link
                href="/quem-somos"
                className="block rounded-lg px-3 py-2 hover:bg-brand-50"
                onClick={closeMobileMenu}
              >
                Quem somos?
              </Link>
            </li>

            {/* PESSOA FÍSICA LOGADA */}
            {isAuthenticated && variant === "pessoa-fisica" && (
              <>
                <li>
                  <Link
                    href="/pessoa-fisica/home"
                    className="block rounded-lg px-3 py-2 hover:bg-brand-50 text-brand-700"
                    onClick={closeMobileMenu}
                  >
                    Quero adotar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pessoa-fisica/cadastrar-pet"
                    className="block rounded-lg px-3 py-2 hover:bg-brand-50 text-brand-700"
                    onClick={closeMobileMenu}
                  >
                    Colocar na adoção
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pessoa-fisica/editar-perfil"
                    className="block rounded-lg px-3 py-2 hover:bg-brand-50 text-brand-700"
                    onClick={closeMobileMenu}
                  >
                    Editar Perfil
                  </Link>
                </li>
              </>
            )}

            {/* ONG LOGADA */}
            {isAuthenticated && variant === "ong" && (
              <>
                <li>
                  <Link
                    href="/ong/dashboard"
                    className="block rounded-lg px-3 py-2 hover:bg-brand-50 text-brand-700"
                    onClick={closeMobileMenu}
                  >
                    Painel da ONG
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ong/cadastrar-pet"
                    className="block rounded-lg px-3 py-2 hover:bg-brand-50 text-brand-700"
                    onClick={closeMobileMenu}
                  >
                    Cadastrar Pet
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ong/editar-perfil"
                    className="block rounded-lg px-3 py-2 hover:bg-brand-50 text-brand-700"
                    onClick={closeMobileMenu}
                  >
                    Editar Perfil
                  </Link>
                </li>
              </>
            )}

            <li className="pt-2 mt-4 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <span className="block px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Logado como {user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                    className="w-full rounded-lg bg-slate-800 px-3 py-3 text-center font-bold text-white shadow-sm transition-colors hover:bg-slate-900"
                  >
                    Sair da conta
                  </button>
                </div>
              ) : (
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
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
