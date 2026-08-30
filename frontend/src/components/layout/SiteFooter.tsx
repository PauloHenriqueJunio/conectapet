"use client";

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
      <div className="flex items-center justify-center">
        <p className="text-center text-sm text-slate-600">
          © {new Date().getFullYear()} ConectaPet. Adoção responsável começa com
          informação.
        </p>
      </div>
    </footer>
  );
}
