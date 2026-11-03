"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Pet } from "@/types/api";
import { prefetchPet } from "@/lib/petCache";
import { PetCard } from "@/components/pets/PetCard";
import { PetQuickView } from "@/components/pets/PetQuickView";
import { PetFilterBar } from "@/components/pets/PetFilterBar";
import { MousePointerClick } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

const FEATURED_COUNT = 3;

export default function HomePage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [ongsCount, setOngsCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePet, setActivePet] = useState<Pet | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sizeFilter, setSizeFilter] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [castratedFilter, setCastratedFilter] = useState(false);
  const [vaccinatedFilter, setVaccinatedFilter] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCityFilter(cityInput.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [cityInput]);

  const activeFiltersCount = [
    speciesFilter,
    sizeFilter,
    cityFilter,
    sexFilter,
    castratedFilter,
    vaccinatedFilter,
  ].filter(Boolean).length;

  const clearMoreFilters = () => {
    setSpeciesFilter("");
    setSizeFilter("");
    setCityInput("");
    setSexFilter("");
    setCastratedFilter(false);
    setVaccinatedFilter(false);
  };

  const visiblePets = pets.filter((pet) =>
    searchTerm ? pet.name.toLowerCase().includes(searchTerm.toLowerCase()) : true,
  );

  // "Destaques" só aparece na navegação livre (sem busca/filtro ativo): é
  // uma seção de descoberta, não deve se misturar com um resultado de busca.
  const showFeatured = activeFiltersCount === 0 && !searchTerm;

  const featuredPets = useMemo(() => {
    if (!showFeatured) return [];
    return [...pets]
      .filter((pet) => !pet.isAdopted)
      .sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .slice(0, FEATURED_COUNT);
  }, [pets, showFeatured]);

  const featuredIds = useMemo(
    () => new Set(featuredPets.map((pet) => pet.id)),
    [featuredPets],
  );

  const gridPets = showFeatured
    ? visiblePets.filter((pet) => !featuredIds.has(pet.id))
    : visiblePets;

  const availableCount = pets.filter((pet) => !pet.isAdopted).length;

  useEffect(() => {
    apiFetch<{ id: string }[]>("/auth/ongs")
      .then((data) => setOngsCount(data.length))
      .catch(() => {
        // Não trava a home se a lista de ONGs falhar: o hero só esconde a
        // estatística quando ela não está disponível.
      });
  }, []);

  useEffect(() => {
    const loadPets = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (speciesFilter) params.set("species", speciesFilter);
        if (sizeFilter) params.set("size", sizeFilter);
        if (cityFilter.trim()) params.set("city", cityFilter.trim());
        if (sexFilter) params.set("sex", sexFilter);
        if (castratedFilter) params.set("isCastrated", "true");
        if (vaccinatedFilter) params.set("isVaccinated", "true");

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await apiFetch<Pet[]>(`/pets${query}`);
        setPets(data);
      } catch {
        setError("Não foi possível carregar os pets no momento.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, [
    speciesFilter,
    sizeFilter,
    cityFilter,
    sexFilter,
    castratedFilter,
    vaccinatedFilter,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader page="home" variant="public" />

      <section className="relative bg-brand-600 px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-0">
            Encontre seu novo melhor amigo
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto font-medium">
            Centenas de cães e gatos resgatados por ONGs parceiras estão
            esperando por um lar cheio de amor. Adote e transforme uma vida!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
              {availableCount} pets esperando um lar
            </span>
            {ongsCount !== null && (
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                {ongsCount} ONGs parceiras
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#todos-os-pets"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              Quero adotar
            </a>
            <Link
              href="/register?role=ONG"
              className="rounded-xl border border-white/60 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Sou uma ONG · cadastrar pets
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        {showFeatured && featuredPets.length > 0 && (
          <section className="mb-12">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  Prioridade de adoção
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Esperando há mais tempo
                </h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  variant="featured"
                  onOpen={setActivePet}
                  onHoverPrefetch={(hovered) => {
                    prefetchPet(hovered.id);
                    router.prefetch(`/pet/${hovered.id}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <section
          id="todos-os-pets"
          className="mb-6 flex flex-col items-center justify-center gap-2 text-center md:items-start md:text-left"
        >
          <h2 className="text-3xl font-bold text-slate-900">
            {showFeatured ? "Todos os pets" : "Pets para adoção"}
          </h2>

          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
            <MousePointerClick size={16} />
            <span>Aperte para saber mais</span>
          </div>
        </section>

        <PetFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          showMoreFilters={showMoreFilters}
          onToggleMoreFilters={() => setShowMoreFilters((prev) => !prev)}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearMoreFilters}
          speciesFilter={speciesFilter}
          onSpeciesChange={setSpeciesFilter}
          sizeFilter={sizeFilter}
          onSizeChange={setSizeFilter}
          sexFilter={sexFilter}
          onSexChange={setSexFilter}
          cityValue={cityInput}
          onCityChange={setCityInput}
          castratedFilter={castratedFilter}
          onCastratedChange={setCastratedFilter}
          vaccinatedFilter={vaccinatedFilter}
          onVaccinatedChange={setVaccinatedFilter}
        />

        {error && (
          <div
            className="mb-8 rounded-2xl border p-4 text-center font-medium"
            style={{
              backgroundColor: STATUS_COLORS.danger[50],
              borderColor: STATUS_COLORS.danger[100],
              color: STATUS_COLORS.danger[700],
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gridPets.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500">
                Nenhum pet encontrado com esses filtros.
              </div>
            ) : (
              gridPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onOpen={setActivePet}
                  onHoverPrefetch={(hovered) => {
                    prefetchPet(hovered.id);
                    router.prefetch(`/pet/${hovered.id}`);
                  }}
                />
              ))
            )}
          </section>
        )}
      </main>

      <AnimatePresence>
        {activePet && (
          <PetQuickView
            pet={activePet}
            onClose={() => setActivePet(null)}
            onViewMore={() => {
              router.push(`/pet/${activePet.id}`);
              setActivePet(null);
            }}
          />
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
