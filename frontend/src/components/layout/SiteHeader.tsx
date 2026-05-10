"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { DesktopNavLinks } from "./site-header/DesktopNavLinks";
import { DesktopUserActions } from "./site-header/DesktopUserActions";
import { MobileNavLinks } from "./site-header/MobileNavLinks";
import { MobileUserActions } from "./site-header/MobileUserActions";
import type {
  HeaderNavKey,
  HeaderPage,
  HeaderVariant,
} from "./site-header/types";

interface SiteHeaderProps {
  page: HeaderPage;
  variant?: HeaderVariant;
}

export function SiteHeader({ page, variant = "public" }: SiteHeaderProps) {
  const { logout, isAuthenticated, user } = useAuth();
  const { theme, mounted } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);
  const [activeNav, setActiveNav] = useState<HeaderNavKey>(page);

  const effectiveVariant: HeaderVariant =
    user?.role === "ONG" ? "ong" : isAuthenticated ? variant : "public";

  useEffect(() => {
    setActiveNav(page);
  }, [page]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      const clickedDesktopDropdown =
        userDropdownRef.current && userDropdownRef.current.contains(targetNode);
      const clickedMobileDropdown =
        mobileDropdownRef.current &&
        mobileDropdownRef.current.contains(targetNode);

      if (!clickedDesktopDropdown && !clickedMobileDropdown) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsMenuOpen(false);

  const getEditProfileLink = () => {
    if (variant === "ong" || user?.role === "ONG") return "/ong/editar-perfil";
    return "/pessoa-fisica/editar-perfil";
  };

  const getLogoLink = () => {
    if (effectiveVariant === "ong") return "/ong/dashboard";
    if (effectiveVariant === "pessoa-fisica") return "/pessoa-fisica/home";
    return "/";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b px-5 shadow-sm backdrop-blur-xl transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href={getLogoLink()} className="flex items-center gap-3">
            {!logoFailed && mounted ? (
              <img
                src={theme === "dark" ? "/logo-dark.svg" : "/logo-white.svg"}
                alt="ConectaPet"
                className="h-10 w-auto max-w-[180px]"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span
                className="text-xl font-extrabold tracking-tight text-brand-800 dark:text-brand-600"
                style={{ visibility: mounted ? "visible" : "hidden" }}
              >
                Conecta
                <span className="text-slate-900 dark:text-slate-100">Pet</span>
              </span>
            )}
          </Link>
        </div>

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

        <div className="hidden items-center gap-6 md:flex">
          <DesktopNavLinks
            activeNav={activeNav}
            effectiveVariant={effectiveVariant}
          />
          <DesktopUserActions
            displayName={user?.name}
            editProfileHref={getEditProfileLink()}
            isAuthenticated={isAuthenticated}
            isUserDropdownOpen={isUserDropdownOpen}
            logout={logout}
            setIsUserDropdownOpen={setIsUserDropdownOpen}
            userDropdownRef={userDropdownRef}
          />
        </div>
      </nav>

      <div
        className={`grid overflow-hidden transition-all duration-300 md:hidden ${isMenuOpen ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0">
          <ul className="space-y-2 border-t border-slate-200 pt-3 text-sm font-medium text-slate-700">
            <MobileNavLinks
              effectiveVariant={effectiveVariant}
              closeMobileMenu={closeMobileMenu}
            />

            <li className="pt-2 mt-4 border-t border-slate-100">
              <MobileUserActions
                closeMobileMenu={closeMobileMenu}
                displayName={user?.name}
                editProfileHref={getEditProfileLink()}
                isAuthenticated={isAuthenticated}
                isUserDropdownOpen={isUserDropdownOpen}
                logout={logout}
                setIsUserDropdownOpen={setIsUserDropdownOpen}
                userDropdownRef={mobileDropdownRef}
              />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
