"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderPage = "home" | "ongs" | "quem-somos";

interface SiteHeaderProps {
  page: HeaderPage;
}

export function SiteHeader({ page }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState<
    "home" | "colocar-na-adocao" | "ongs" | "quem-somos"
  >(page === "ongs" ? "ongs" : page === "quem-somos" ? "quem-somos" : "home");

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  const colocarNaAdocaoHref = "/dashboard";

  const navClass = (
    key: "home" | "colocar-na-adocao" | "ongs" | "quem-somos",
  ) =>
    `rounded-md px-2 py-1 transition ${
      activeNav === key
        ? "bg-brand-100 text-brand-800"
        : "text-slate-700 hover:text-brand-700"
    }`;

  return (
    <header
      className={`sticky top-4 z-30 mb-8 rounded-3xl border border-white/50 bg-gradient-to-r from-white/95 via-white/90 to-brand-50/85 px-5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <nav className="flex items-center justify-between gap-4">
        <div className="max-w-sm">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-brand-800"
            onClick={() => setActiveNav("home")}
          >
            ConectaPet
          </Link>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Encontre um novo melhor amigo e transforme vidas com adocao
            responsavel.
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-slate-700 transition-all duration-300 ${
                isMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-slate-700 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-slate-700 transition-all duration-300 ${
                isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-700">
            <li>
              <Link
                href="/"
                className={navClass("home")}
                onClick={() => setActiveNav("home")}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={colocarNaAdocaoHref}
                className={navClass("colocar-na-adocao")}
                onClick={() => setActiveNav("colocar-na-adocao")}
              >
                Colocar na adocao
              </Link>
            </li>
            <li>
              <Link
                href="/ongs"
                className={navClass("ongs")}
                onClick={() => setActiveNav("ongs")}
              >
                Verificar ONGS
              </Link>
            </li>
            <li>
              <Link
                href="/quem-somos"
                className={navClass("quem-somos")}
                onClick={() => setActiveNav("quem-somos")}
              >
                Quem somos?
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg border border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`grid overflow-hidden transition-all duration-300 md:hidden ${
          isMenuOpen ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <ul className="space-y-2 border-t border-slate-200 pt-3 text-sm font-medium text-slate-700">
            <li>
              <Link
                href="/"
                className={`block rounded-lg px-3 py-2 transition hover:bg-brand-50 ${
                  activeNav === "home" ? "bg-brand-100 text-brand-800" : ""
                }`}
                onClick={() => {
                  setActiveNav("home");
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={colocarNaAdocaoHref}
                className={`block rounded-lg px-3 py-2 transition hover:bg-brand-50 ${
                  activeNav === "colocar-na-adocao"
                    ? "bg-brand-100 text-brand-800"
                    : ""
                }`}
                onClick={() => {
                  setActiveNav("colocar-na-adocao");
                  setIsMenuOpen(false);
                }}
              >
                Colocar na adocao
              </Link>
            </li>
            <li>
              <Link
                href="/ongs"
                className={`block rounded-lg px-3 py-2 transition hover:bg-brand-50 ${
                  activeNav === "ongs" ? "bg-brand-100 text-brand-800" : ""
                }`}
                onClick={() => {
                  setActiveNav("ongs");
                  setIsMenuOpen(false);
                }}
              >
                Verificar ONGS
              </Link>
            </li>
            <li>
              <Link
                href="/quem-somos"
                className={`block rounded-lg px-3 py-2 transition hover:bg-brand-50 ${
                  activeNav === "quem-somos"
                    ? "bg-brand-100 text-brand-800"
                    : ""
                }`}
                onClick={() => {
                  setActiveNav("quem-somos");
                  setIsMenuOpen(false);
                }}
              >
                Quem somos?
              </Link>
            </li>
            <li className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                className="rounded-lg border border-brand-300 px-3 py-2 text-center font-semibold text-brand-700 transition hover:bg-brand-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-3 py-2 text-center font-semibold text-white transition hover:bg-brand-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
