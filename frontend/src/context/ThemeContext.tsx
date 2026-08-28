"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  applyTheme,
  readAppliedTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

interface ThemeContextProps {
  theme: Theme;
  /** false durante o SSR e a primeira renderizacao no cliente. */
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  mounted: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // O tema ja foi aplicado no <html> por themeInitScript; aqui apenas lemos
  // o que esta valendo para manter o estado do React em sincronia.
  const [theme, setThemeState] = useState<Theme>(readAppliedTheme);
  const [mounted, setMounted] = useState(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setThemeState(readAppliedTheme());

    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // Acompanha a preferencia do sistema enquanto o usuario nao escolher
  // explicitamente um tema.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      } catch {
        // localStorage indisponivel: segue a preferencia do sistema
      }
      const next: Theme = event.matches ? "dark" : "light";
      applyTheme(next);
      setThemeState(next);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Anima somente a troca de tema (ver .theme-transition em globals.css).
    root.classList.add("theme-transition");
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    transitionTimeout.current = setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimeout.current = null;
    }, 300);

    applyTheme(next);
    setThemeState(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // modo privado / storage bloqueado: o tema vale so para esta sessao
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readAppliedTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, mounted, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
