"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { isPetVaccinated } from "@/lib/pet";
import { prefetchPet } from "@/lib/petCache";
import { PetCard } from "@/components/pets/PetCard";
import { PetQuickView } from "@/components/pets/PetQuickView";
import { PetFilterBar } from "@/components/pets/PetFilterBar";
import { Heart, Info } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

export default function PessoaFisicaHome() {
  const router = useRouter();
  const { token, user, isLoading: authLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePet, setActivePet] = useState<Pet | null>(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sizeFilter, setSizeFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [castratedFilter, setCastratedFilter] = useState(false);
  const [vaccinatedFilter, setVaccinatedFilter] = useState(false);

  const activeFiltersCount = [
    speciesFilter,
    sizeFilter,
    sexFilter,
    cityFilter,
    castratedFilter,
    vaccinatedFilter,
  ].filter(Boolean).length;

  const clearMoreFilters = () => {
    setSpeciesFilter("");
    setSizeFilter("");
    setSexFilter("");
    setCityFilter("");
    setCastratedFilter(false);
    setVaccinatedFilter(false);
  };

  useEffect(() => {
    const fetchPets = async () => {
      if (!token) return;
      try {
        const data = await apiFetch<Pet[]>("/pets", undefined, token);
        setPets(data);
      } catch (err) {
        setError("Não foi possível carregar os animais disponíveis.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchPets();
    }
  }, [token, authLoading]);

  // Lógica de Filtragem (Pesquisa + Espécie + Apenas Disponíveis)
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // 1. Só mostra quem não está adotado
      if (pet.isAdopted) return false;

      // 2. Filtro por Espécie
      if (speciesFilter && pet.species !== speciesFilter) return false;

      // 3. Filtro por Pesquisa de Nome
      if (
        searchTerm &&
        !pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      // 4. Filtro por Porte
      if (sizeFilter && pet.size !== sizeFilter) return false;

      // 5. Filtro por Sexo
      if (sexFilter && pet.sex !== sexFilter) return false;

      // 6. Filtro por Cidade
      if (
        cityFilter &&
        !pet.ong?.city?.toLowerCase().includes(cityFilter.trim().toLowerCase())
      )
        return false;

      // 7. Filtro por Castrado
      if (castratedFilter && !pet.isCastrated) return false;

      // 8. Filtro por Vacinado (qualquer vacina aplicada)
      if (vaccinatedFilter && !isPetVaccinated(pet)) return false;

      return true;
    });
  }, [
    pets,
    speciesFilter,
    searchTerm,
    sizeFilter,
    sexFilter,
    cityFilter,
    castratedFilter,
    vaccinatedFilter,
  ]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* HEADER & BOAS-VINDAS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Encontre seu novo{" "}
            <span className="text-brand-600">melhor amigo</span> 🐾
          </h1>
          <p className="text-slate-500 mt-2 text-lg max-w-2xl">
            Dezenas de animais resgatados estão esperando por um lar cheio de
            amor. Use os filtros abaixo para encontrar o pet perfeito para você,{" "}
            {user?.name?.split(" ")[0] || "amigo"}.
          </p>
        </div>
      </div>

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
        cityValue={cityFilter}
        onCityChange={setCityFilter}
        castratedFilter={castratedFilter}
        onCastratedChange={setCastratedFilter}
        vaccinatedFilter={vaccinatedFilter}
        onVaccinatedChange={setVaccinatedFilter}
      />

      {error && (
        <div
          className="mb-8 flex items-center gap-3 rounded-xl border p-4"
          style={{
            backgroundColor: STATUS_COLORS.danger[50],
            borderColor: STATUS_COLORS.danger[200],
            color: STATUS_COLORS.danger[700],
          }}
        >
          <Info size={20} />
          <p>{error}</p>
        </div>
      )}
      {filteredPets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <Heart className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">
            Nenhum pet encontrado
          </h3>
          <p className="text-slate-500 mt-2 max-w-md">
            Não encontramos nenhum animalzinho com os filtros selecionados no
            momento. Tente limpar a busca!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onOpen={setActivePet}
              onHoverPrefetch={(hovered) => {
                prefetchPet(hovered.id);
                router.prefetch(`/pet/${hovered.id}`);
              }}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}
