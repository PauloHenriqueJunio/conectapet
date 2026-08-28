"use client";

import { PawPrint, Gift } from "lucide-react";
import { ONG_CONSTANTS } from "@/lib/constants/ong.constants";

interface OngCtaSectionProps {
  onScrollToPets: () => void;
}

export function OngCtaSection({ onScrollToPets }: OngCtaSectionProps) {
  return (
    <div className="space-y-6 self-start lg:sticky lg:top-28">
      {/* Quer Adotar? */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:from-[var(--bg-card)] dark:to-[var(--bg-secondary)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <PawPrint size={28} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          {ONG_CONSTANTS.CTA.ADOPT.TITLE}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          {ONG_CONSTANTS.CTA.ADOPT.DESCRIPTION}
        </p>
        <button
          type="button"
          onClick={onScrollToPets}
          className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {ONG_CONSTANTS.CTA.ADOPT.BUTTON}
        </button>
      </div>

      {/* Seja um Padrinho */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:from-[var(--bg-card)] dark:to-[var(--bg-secondary)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <Gift size={28} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          {ONG_CONSTANTS.CTA.SPONSOR.TITLE}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          {ONG_CONSTANTS.CTA.SPONSOR.DESCRIPTION}
        </p>
        <button className="w-full rounded-full border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
          {ONG_CONSTANTS.CTA.SPONSOR.BUTTON}
        </button>
      </div>
    </div>
  );
}
