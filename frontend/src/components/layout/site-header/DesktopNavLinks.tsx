"use client";

import Link from "next/link";
import type { HeaderNavKey, HeaderVariant } from "./types";

interface DesktopNavLinksProps {
  activeNav: HeaderNavKey;
  effectiveVariant: HeaderVariant;
}

type NavItem = {
  href: string;
  label: string;
  key: HeaderNavKey;
};

export function DesktopNavLinks({
  activeNav,
  effectiveVariant,
}: DesktopNavLinksProps) {
  const navItems: NavItem[] =
    effectiveVariant === "public"
      ? [
          { href: "/home", label: "Home", key: "home" },
          { href: "/ongs", label: "Verificar ONGs", key: "ongs" },
          { href: "/", label: "Quem somos?", key: "quem-somos" },
        ]
      : effectiveVariant === "pessoa-fisica"
        ? [
            {
              href: "/pessoa-fisica/home",
              label: "Quero adotar",
              key: "quero-adotar",
            },
            {
              href: "/pessoa-fisica/cadastrar-pet",
              label: "Colocquem-somosar na adoção",
              key: "colocar-na-adocao",
            },
            {
              href: "/pessoa-fisica/minhas-solicitacoes",
              label: "Minhas solicitações",
              key: "minhas-solicitacoes",
            },
          ]
        : [
            {
              href: "/ong/dashboard",
              label: "Solicitações de adoção",
              key: "dashboard-home",
            },
            {
              href: "/ong/cadastrar-pet",
              label: "Cadastrar Pet",
              key: "dashboard-cadastrar-pet",
            },
            {
              href: "/ong/editar",
              label: "Editar Pets",
              key: "dashboard-editar",
            },
          ];

  const getLinkClassName = (key: HeaderNavKey) =>
    `rounded-md px-2 py-1 transition ${
      activeNav === key
        ? "bg-brand-100 text-brand-800 font-bold"
        : "text-slate-700 hover:text-brand-700 font-medium"
    }`;

  return (
    <ul className="flex flex-wrap items-center gap-5 text-sm">
      {navItems.map((item) => (
        <li key={item.key}>
          <Link href={item.href} className={getLinkClassName(item.key)}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
