"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
interface ThemeContextProps {
  theme: Theme | null;
  mounted: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let resolvedTheme: Theme = "light";

    try {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        resolvedTheme = saved;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        resolvedTheme = "dark";
      }
    } catch (e) {
      // keep light as the fallback
    }

    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!theme) return;

    document.documentElement.setAttribute("data-theme", theme);
    // keep Tailwind's dark variant compatibility
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
