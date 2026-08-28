"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] transition hover:border-[var(--brand)] hover:text-[var(--brand-text)]"
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar entre tema claro e escuro"
    >
      {/* Os dois icones sao renderizados e alternados por CSS: o tema ja esta
          aplicado no <html> antes da hidratacao, entao nao ha piscada nem
          divergencia entre servidor e cliente. */}
      <MoonStar size={18} className="dark:hidden" aria-hidden="true" />
      <SunMedium size={18} className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}
