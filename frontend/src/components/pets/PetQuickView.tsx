"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, X } from "lucide-react";
import { Pet } from "@/types/api";
import { isPetVaccinated } from "@/lib/pet";

interface PetQuickViewProps {
  pet: Pet;
  onClose: () => void;
  onViewMore: () => void;
}

/** Card expansivel no estilo Aceternity: ao clicar em um card do grid, esse
 *  overlay "assume o lugar" dele (mesmo layoutId) e expande mostrando um
 *  resumo do pet com um botao para ir ate a pagina completa. */
export function PetQuickView({ pet, onClose, onViewMore }: PetQuickViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        ref={cardRef}
        layoutId={`pet-card-${pet.id}`}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md transition hover:bg-white"
        >
          <X size={18} />
        </button>

        <motion.div
          layoutId={`pet-image-${pet.id}`}
          className="relative h-64 w-full bg-slate-100"
        >
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Camera size={48} className="text-slate-300" />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-4 p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {pet.name}
              </h3>
              <p className="text-sm font-semibold text-slate-500">
                {pet.species} · {pet.age} {pet.age === 1 ? "ano" : "anos"} ·{" "}
                {pet.size || "Médio"}
              </p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
              {pet.sex || "Indefinido"}
            </span>
          </div>

          {(pet.ong?.city || pet.ong?.state) && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={16} className="text-brand-400" />
              {pet.ong?.city}
              {pet.ong?.state ? `, ${pet.ong.state}` : ""}
            </div>
          )}

          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
            {pet.description?.trim() ||
              `${pet.name} está esperando por um lar cheio de amor. ${
                pet.isCastrated ? "Já castrado" : "Ainda não castrado"
              } e ${
                isPetVaccinated(pet) ? "vacinado" : "com vacinas pendentes"
              }.`}
          </p>

          <button
            type="button"
            onClick={onViewMore}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-700"
          >
            Aperte para saber mais
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
