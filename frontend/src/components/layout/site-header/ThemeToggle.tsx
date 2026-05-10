"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      disabled={!mounted}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] transition hover:border-[var(--brand)] hover:text-[var(--brand-text)]"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
