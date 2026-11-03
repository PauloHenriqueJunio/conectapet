"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Check, MapPin, ArrowRight } from "lucide-react";
import { Pet } from "@/types/api";
import { isPetVaccinated, formatWaitLabel } from "@/lib/pet";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

interface PetCardProps {
  pet: Pet;
  onOpen: (pet: Pet) => void;
  onHoverPrefetch?: (pet: Pet) => void;
  /** "featured" destaca o card (usado na seção de prioridade de adoção, com
   *  o badge de tempo de espera); "default" é o card padrão da listagem. */
  variant?: "featured" | "default";
}

/** Card de pet único, usado pela home pública e pela home logada (antes
 *  cada página tinha sua própria cópia quase idêntica deste card). */
export function PetCard({
  pet,
  onOpen,
  onHoverPrefetch,
  variant = "default",
}: PetCardProps) {
  const isFeatured = variant === "featured";

  return (
    <motion.div
      key={pet.id}
      layoutId={`pet-card-${pet.id}`}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      role="link"
      tabIndex={0}
      onMouseEnter={() => onHoverPrefetch?.(pet)}
      onClick={() => onOpen(pet)}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        onOpen(pet);
      }}
      className="group h-full cursor-pointer"
    >
      <CardContainer containerClassName="p-0 w-full h-full" className="w-full h-full">
        <CardBody
          className={`flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow duration-300 hover:shadow-xl hover:ring-brand-200 ${
            isFeatured ? "ring-brand-100" : ""
          }`}
        >
          <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-slate-100">
            {pet.photoUrl ? (
              <motion.img
                layoutId={`pet-image-${pet.id}`}
                src={pet.photoUrl}
                alt={pet.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Camera size={40} className="text-slate-300" />
            )}

            {isFeatured && (
              <div className="absolute left-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800 shadow-sm">
                {formatWaitLabel(pet.createdAt)}
              </div>
            )}

            {pet.isAdopted && (
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                Adotado
              </div>
            )}
          </div>

          <CardItem translateZ={30} className="flex w-full flex-1 flex-col p-4">
            <div className="mb-1.5 flex items-start justify-between">
              <h3
                className="max-w-[70%] truncate text-lg font-extrabold text-slate-900 transition-colors group-hover:text-brand-600"
                title={pet.name}
              >
                {pet.name}
              </h3>
              <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {pet.sex || (pet.species === "Gato" ? "Gato" : "Cão")}
              </span>
            </div>

            <div className="mb-2 flex gap-1.5">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-600">
                {pet.age} {pet.age === 1 ? "ano" : "anos"}
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-600">
                {pet.size || "Médio"}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={14} className="shrink-0 text-brand-400" />
              {pet.ong?.id ? (
                <Link
                  href={`/ongs/${pet.ong.id}`}
                  onClick={(event) => event.stopPropagation()}
                  className="truncate font-semibold text-slate-800"
                  title={pet.ong?.name}
                >
                  {pet.ong?.name}
                </Link>
              ) : (
                <span className="truncate font-semibold text-slate-800" title={pet.ong?.name}>
                  {pet.ong?.name || "Abrigo Parceiro"}
                </span>
              )}
            </div>

            <div className="mb-4 flex gap-3 border-t border-slate-100 pt-3 text-[11px] font-semibold">
              <span
                className={`flex items-center gap-1 ${pet.isCastrated ? "text-brand-600" : "text-slate-400"}`}
              >
                <Check size={12} strokeWidth={3} /> Castrado
              </span>
              <span
                className={`flex items-center gap-1 ${isPetVaccinated(pet) ? "text-brand-600" : "text-slate-400"}`}
              >
                <Check size={12} strokeWidth={3} /> Vacinado
              </span>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(pet);
              }}
              className={`mt-auto flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-colors ${
                isFeatured
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-slate-50 text-slate-800 hover:bg-slate-100"
              }`}
            >
              Ver perfil
              <ArrowRight size={15} />
            </button>
          </CardItem>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}
