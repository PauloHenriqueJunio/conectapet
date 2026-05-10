import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
      <body
        className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
