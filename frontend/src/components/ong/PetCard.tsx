"use client";

import Link from "next/link";
import { Pet, ONG_CONSTANTS } from "@/lib/constants/ong.constants";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <Link
      href={`/pet/${pet.id}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="h-52 bg-slate-100 bg-cover bg-center"
        style={{
          backgroundImage: pet.photoUrl ? `url('${pet.photoUrl}')` : undefined,
        }}
      />
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{pet.name}</h3>
            <p className="text-sm text-slate-500">{pet.species}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {ONG_CONSTANTS.PETS.STATUS_AVAILABLE}
          </span>
        </div>

        <p className="text-sm text-slate-600">
          {pet.age} ano{pet.age !== 1 ? "s" : ""} de idade
        </p>

        <span className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-600 transition group-hover:bg-brand-50">
          {ONG_CONSTANTS.PETS.VIEW_PROFILE}
        </span>
      </div>
    </Link>
  );
}
