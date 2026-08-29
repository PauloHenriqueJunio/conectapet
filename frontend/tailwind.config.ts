import type { Config } from "tailwindcss";

/** Cor semantica lida de tokens.css com suporte a opacidade (bg-card/50). */
const token = (name: string) => `rgb(var(--rgb-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effbf3",
          100: "#d9f5e2",
          200: "#b5eac8",
          300: "#84d8a2",
          400: "#4fbd76",
          500: "#2f9f5a",
          600: "#1f7f46",
          700: "#1a6539",
          800: "#185030",
          900: "#164228",
        },
        // Cores semanticas do tema, usadas por components/ui (shadcn).
        background: token("background"),
        foreground: token("foreground"),
        card: {
          DEFAULT: token("card"),
          foreground: token("foreground"),
        },
        popover: {
          DEFAULT: token("card"),
          foreground: token("foreground"),
        },
        primary: {
          DEFAULT: token("primary"),
          foreground: token("primary-foreground"),
        },
        secondary: {
          DEFAULT: token("muted"),
          foreground: token("foreground"),
        },
        muted: {
          DEFAULT: token("muted"),
          foreground: token("muted-foreground"),
        },
        accent: {
          DEFAULT: token("muted"),
          foreground: token("foreground"),
        },
        destructive: {
          DEFAULT: token("destructive"),
          foreground: token("destructive-foreground"),
        },
        border: token("border"),
        input: token("border"),
        ring: token("ring"),
      },
      boxShadow: {
        elevation: "var(--shadow-elevation)",
      },
    },
  },
  plugins: [],
};

export default config;
