"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "mt-12 rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-6 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-slate-600">
          © {new Date().getFullYear()} ConectaPet. Adoção responsável começa com
          informação.
        </p>

        <nav className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <Link href="/termos-de-uso" className="hover:text-brand-700 hover:underline">
            Termos de Uso
          </Link>
          <Link
            href="/politica-de-privacidade"
            className="hover:text-brand-700 hover:underline"
          >
            Política de Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  );
}
