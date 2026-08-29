export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Espelha --bg-page de tokens.css para a <meta name="theme-color">. */
export const THEME_COLOR_META = {
  light: "#f8faf8",
  dark: "#0f1117",
} as const;

/**
 * Script injetado no <head> e executado antes da primeira pintura, para
 * aplicar o tema salvo. Sem ele a pagina renderiza clara e "pisca" para
 * escura durante a hidratacao.
 *
 * Precisa ficar em sincronia com applyTheme() -- nao da para gerar este
 * script a partir do codigo de applyTheme() via Function.prototype.toString,
 * porque o minificador de producao remove/renomeia os nomes das funcoes
 * (ja testado: quebra o script no build). Qualquer mudanca aqui tem que ser
 * replicada manualmente em applyTheme(), e vice-versa.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var e=document.documentElement;e.classList.toggle("dark",t==="dark");e.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"${THEME_COLOR_META.dark}":"${THEME_COLOR_META.light}");}catch(_){}})();`;

/** Aplica o tema no <html>. Espelha o que themeInitScript faz. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", THEME_COLOR_META[theme]);
}

/** Le do DOM o tema que ja esta aplicado. */
export function readAppliedTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
