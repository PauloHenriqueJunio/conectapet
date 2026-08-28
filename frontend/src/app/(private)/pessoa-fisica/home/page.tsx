"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { isPetVaccinated } from "@/lib/pet";
import { prefetchPet } from "@/lib/petCache";
import { usePetPhotoTransition } from "@/context/PetPhotoTransitionContext";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  Search,
  MapPin,
  Heart,
  Info,
  Camera,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

type SpeciesFilter = "TODOS" | "Cão" | "Gato";

export default function PessoaFisicaHome() {
  const router = useRouter();
  const { startPhotoExpand } = usePetPhotoTransition();
  const { token, user, isLoading: authLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("TODOS");

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sizeFilter, setSizeFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [castratedFilter, setCastratedFilter] = useState(false);
  const [vaccinatedFilter, setVaccinatedFilter] = useState(false);

  const activeExtraFiltersCount = [
    sizeFilter,
    sexFilter,
    cityFilter,
    castratedFilter,
    vaccinatedFilter,
  ].filter(Boolean).length;

  const clearMoreFilters = () => {
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
      if (speciesFilter !== "TODOS" && pet.species !== speciesFilter)
        return false;

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

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4">
        {/* Input de Pesquisa */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar pet pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Botões de Espécie */}
        <div className="flex gap-2">
          {(["TODOS", "Cão", "Gato"] as SpeciesFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setSpeciesFilter(filter)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex-1 sm:flex-none ${
                speciesFilter === filter
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter === "TODOS"
                ? "Todos"
                : filter === "Cão"
                  ? "Cães"
                  : "Gatos"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowMoreFilters((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            <SlidersHorizontal size={16} />
            Mais filtros
            {activeExtraFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {activeExtraFiltersCount}
              </span>
            )}
            <ChevronDown
              size={16}
              className={`transition-transform ${showMoreFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showMoreFilters && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="size-filter"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Porte
                </label>
                <select
                  id="size-filter"
                  value={sizeFilter}
                  onChange={(event) => setSizeFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">Todos</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sex-filter"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Sexo
                </label>
                <select
                  id="sex-filter"
                  value={sexFilter}
                  onChange={(event) => setSexFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">Todos</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="city-filter"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Cidade
                </label>
                <input
                  id="city-filter"
                  type="text"
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  placeholder="Ex: São Paulo"
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex flex-col justify-end gap-2 pb-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={castratedFilter}
                    onChange={(event) =>
                      setCastratedFilter(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  Castrado
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={vaccinatedFilter}
                    onChange={(event) =>
                      setVaccinatedFilter(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  Vacinado
                </label>
              </div>
            </div>

            {activeExtraFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearMoreFilters}
                  className="text-sm font-bold text-brand-600 hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
            <div
              key={pet.id}
              role="link"
              tabIndex={0}
              onMouseEnter={() => {
                prefetchPet(pet.id);
                router.prefetch(`/pet/${pet.id}`);
              }}
              onClick={(event) => {
                const imgEl = event.currentTarget.querySelector("img");
                const rect = imgEl?.getBoundingClientRect();
                if (rect && pet.photoUrl) {
                  startPhotoExpand(pet.id, pet.photoUrl, rect);
                }
                router.push(`/pet/${pet.id}`);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                const imgEl = event.currentTarget.querySelector("img");
                const rect = imgEl?.getBoundingClientRect();
                if (rect && pet.photoUrl) {
                  startPhotoExpand(pet.id, pet.photoUrl, rect);
                }
                router.push(`/pet/${pet.id}`);
              }}
              className="group cursor-pointer h-full"
            >
              <CardContainer containerClassName="p-0 w-full h-full" className="w-full h-full">
                <CardBody className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-shadow duration-300 flex flex-col h-full w-full">
                  <CardItem translateZ={50} className="w-full">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {pet.photoUrl ? (
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 pt-16">
                          <Camera size={40} className="mb-2 opacity-50" />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Pet sem foto
                          </span>
                        </div>
                      )}
                      {/* Badge de Idade por cima da foto */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                        {pet.age} {pet.age === 1 ? "ano" : "anos"}
                      </div>
                    </div>
                  </CardItem>

                  {/* INFORMAÇÕES */}
                  <CardItem translateZ={30} className="flex w-full flex-1 flex-col p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {pet.name}
                    </h3>
                    {pet.species === "Gato" ? "Gato" : "Cão"}
                  </div>

                  {/* Localização (Simulada se não tiver na API) */}
                  <div className="flex flex-col gap-1 text-slate-500 text-sm mt-auto pt-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-brand-500" />
                      {pet.ong?.id ? (
                        <Link
                          href={`/ongs/${pet.ong.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="font-semibold text-slate-800 truncate max-w-[220px]"
                          title={pet.ong?.name}
                        >
                          {pet.ong?.name}
                        </Link>
                      ) : (
                        <span
                          className="font-semibold text-slate-800 truncate max-w-[220px]"
                          title={pet.ong?.name}
                        >
                          {pet.ong?.name || "Abrigo Parceiro"}
                        </span>
                      )}
                    </div>
                    {(pet.ong?.city || pet.ong?.state) && (
                      <div className="text-slate-400 text-xs">
                        {pet.ong?.city
                          ? `${pet.ong.city}${pet.ong.state ? `, ${pet.ong.state}` : ""}`
                          : pet.ong?.state}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Porte
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {pet.size || "Médio"}
                      </span>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Sexo
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {pet.sex || "Indefinido"}
                      </span>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Castrado
                      </span>
                      <span
                        className={`text-sm font-bold ${pet.isCastrated ? "text-brand-600" : "text-slate-700"}`}
                      >
                        {pet.isCastrated ? "Sim" : "Não"}
                      </span>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Vacinado
                      </span>
                      <span
                        className={`text-sm font-bold ${isPetVaccinated(pet) ? "text-brand-600" : "text-slate-700"}`}
                      >
                        {isPetVaccinated(pet) ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
