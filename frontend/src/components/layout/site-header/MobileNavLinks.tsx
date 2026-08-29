"use client";

import Link from "next/link";
import type { HeaderVariant } from "./types";

interface MobileNavLinksProps {
  effectiveVariant: HeaderVariant;
  closeMobileMenu: () => void;
}

type NavItem = {
  href: string;
  label: string;
};

export function MobileNavLinks({
  effectiveVariant,
  closeMobileMenu,
}: MobileNavLinksProps) {
  const navItems: NavItem[] =
    effectiveVariant === "public"
      ? [
          { href: "/home", label: "Home" },
          { href: "/ongs", label: "Verificar ONGs" },
          { href: "/quem-somos", label: "Quem somos?" },
        ]
      : effectiveVariant === "pessoa-fisica"
        ? [
            { href: "/pessoa-fisica/home", label: "Quero adotar" },
            {
              href: "/pessoa-fisica/cadastrar-pet",
              label: "Colocar na adoção",
            },
            {
              href: "/pessoa-fisica/minhas-solicitacoes",
              label: "Minhas solicitações",
            },
          ]
        : [
            {
              href: "/ong/dashboard",
              label: "Solicitações de adoção",
            },
            { href: "/ong/cadastrar-pet", label: "Cadastrar Pet" },
            { href: "/ong/editar", label: "Editar Pets" },
          ];

  return (
    <>
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`block rounded-lg px-3 py-2 hover:bg-brand-50 ${effectiveVariant !== "public" ? "text-brand-700" : ""}`}
            onClick={closeMobileMenu}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </>
  );
}
