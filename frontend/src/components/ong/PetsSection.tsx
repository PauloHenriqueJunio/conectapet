"use client";

import type { RefObject } from "react";
import { PawPrint } from "lucide-react";
import { Pet, ONG, ONG_CONSTANTS } from "@/lib/constants/ong.constants";
import { PetCard } from "./PetCard";

interface PetsSectionProps {
  pets: Pet[];
  ong: ONG;
  petsSectionRef: RefObject<HTMLElement | null>;
}

export function PetsSection({ pets, ong, petsSectionRef }: PetsSectionProps) {
  return (
    <section
      ref={petsSectionRef}
      className="scroll-mt-28 bg-white pb-12 md:pb-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
              <PawPrint size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {ONG_CONSTANTS.PETS.SECTION_LABEL}
              </p>
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                {pets.length} pet{pets.length !== 1 ? "s" : ""} da ONG{" "}
                {ong.name}
              </h2>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-right">
            {ONG_CONSTANTS.PETS.TOUCH_HINT}
          </p>
        </div>

        {/* Pets Grid or Empty State */}
        {pets.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <PawPrint size={40} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900">
              {ONG_CONSTANTS.PETS.EMPTY.TITLE}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {ONG_CONSTANTS.PETS.EMPTY.DESCRIPTION}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
