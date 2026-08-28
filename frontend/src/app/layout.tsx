import "./globals.css";
import "../styles/theme-map.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/ThemeContext";
import { THEME_COLOR_META, themeInitScript } from "@/lib/theme";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ConectaPet",
  description: "Plataforma para conectar ONGs e adotantes de pets.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-v2.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-v2.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Cor da barra do navegador/status bar no mobile. Valor inicial e o
            do tema claro; themeInitScript corrige antes da primeira pintura
            se o tema salvo for escuro. */}
        <meta name="theme-color" content={THEME_COLOR_META.light} />
        {/* Aplica o tema salvo antes da primeira pintura (evita o flash claro). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
