"use client";

import { Building2, Heart, Share2 } from "lucide-react";
import { ONG, ONG_CONSTANTS } from "@/lib/constants/ong.constants";

interface OngHeroSectionProps {
  ong: ONG;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

export function OngHeroSection({
  ong,
  isFavorited,
  onFavoriteToggle,
}: OngHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-400 dark:bg-slate-800 py-20 md:py-28">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${ONG_CONSTANTS.HERO_BG_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/55 to-white/50 dark:to-[rgba(15,17,23,0.55)]"></div>

      {/* Bottom gradient fade to white */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent dark:from-[var(--bg-page)]" />

      {/* Card Content */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)] dark:border-[var(--border-default)] md:p-12">
          {/* Badge */}
          <div className="mb-4 flex justify-center">
            <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              {ONG_CONSTANTS.HERO.BADGE}
            </span>
          </div>

          {/* Icon */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-200/80 ring-8 ring-brand-50">
              <Building2 size={32} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {ong.name}
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-slate-800 md:text-lg font-semibold">
            {ONG_CONSTANTS.HERO.DESCRIPTION}
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onFavoriteToggle}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-400 px-6 py-3 font-semibold text-slate-800 transition hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50"
            >
              <Heart
                size={20}
                className={isFavorited ? "fill-red-500 text-red-500" : ""}
              />
              Favoritar
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-400 px-6 py-3 font-semibold text-slate-800 transition hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50">
              <Share2 size={20} />
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
