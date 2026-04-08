"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { Search, MapPin, Heart, Info, Camera } from "lucide-react";

type SpeciesFilter = "TODOS" | "Cão" | "Gato";

export default function PessoaFisicaHome() {
  const { token, user, isLoading: authLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("TODOS");

  useEffect(() => {
    const fetchPets = async () => {
      if (!token) return;
      try {
        // Supondo que a API retorne todos os pets.
        // Se você tiver uma rota "/pets/available", melhor ainda!
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

      return true;
    });
  }, [pets, speciesFilter, searchTerm]);

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

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3">
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
            <Link href={`/pet/${pet.id}`} key={pet.id} className="group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
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

                {/* INFORMAÇÕES */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {pet.name}
                    </h3>
                    {pet.species === "Gato" ? "Gato" : "Cão"}
                  </div>

                  {/* Localização (Simulada se não tiver na API) */}
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-auto pt-4">
                    <MapPin size={16} className="text-brand-500" />
                    <span>Abrigo Parceiro</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
