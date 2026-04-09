"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Pet } from "@/types/api";
import { MapPin, Camera, Heart, MousePointerClick } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [speciesFilter, setSpeciesFilter] = useState("");

  useEffect(() => {
    const loadPets = async () => {
      setIsLoading(true);
      try {
        const query = speciesFilter
          ? `?species=${encodeURIComponent(speciesFilter)}`
          : "";
        const data = await apiFetch<Pet[]>(`/pets${query}`);
        setPets(data);
      } catch {
        setError("Não foi possível carregar os pets no momento.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, [speciesFilter]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader page="home" variant="public" />

      <section className="relative bg-brand-600 px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
            Encontre seu novo melhor amigo
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto font-medium">
            Centenas de cães e gatos resgatados por ONGs parceiras estão
            esperando por um lar cheio de amor. Adote e transforme uma vida!
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <section className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center md:flex-col md:justify-start md:text-left md:items-start">
            <h2 className="text-3xl font-bold text-slate-900">
              Pets para adoção
            </h2>

            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
              <MousePointerClick size={16} />
              <span>Aperte para saber mais</span>
            </div>
          </div>

          <div className="flex gap-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
            <button
              onClick={() => setSpeciesFilter("")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                speciesFilter === ""
                  ? "bg-slate-800 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSpeciesFilter("Cão")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                speciesFilter === "Cão"
                  ? "bg-brand-500 text-white shadow-md"
                  : "text-slate-500 hover:text-brand-600 hover:bg-brand-50"
              }`}
            >
              🐶 Cães
            </button>
            <button
              onClick={() => setSpeciesFilter("Gato")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                speciesFilter === "Gato"
                  ? "bg-brand-500 text-white shadow-md"
                  : "text-slate-500 hover:text-brand-600 hover:bg-brand-50"
              }`}
            >
              🐱 Gatos
            </button>
          </div>
        </section>

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
            {pets.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500">
                Nenhum pet encontrado com esses filtros.
              </div>
            ) : (
              pets.map((pet) => (
                <Link href={`/pet/${pet.id}`} key={pet.id} className="group">
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-brand-200">
                    <div className="relative h-64 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {pet.photoUrl ? (
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Camera size={48} className="text-slate-300" />
                      )}

                      {pet.isAdopted && (
                        <div className="absolute top-3 right-3 bg-brand-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                          <Heart size={14} fill="currentColor" /> Adotado
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {pet.name}
                        </h2>
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {pet.sex || (pet.species === "Gato" ? "Gato" : "Cão")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mb-4">
                        <MapPin size={16} className="text-brand-400" />
                        <span>Maceió, AL</span>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                        <div className="text-center bg-slate-50 rounded-xl py-2">
                          <span className="block text-[10px] uppercase font-bold text-slate-400">
                            Idade
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {pet.age} {pet.age === 1 ? "ano" : "anos"}
                          </span>
                        </div>
                        <div className="text-center bg-slate-50 rounded-xl py-2">
                          <span className="block text-[10px] uppercase font-bold text-slate-400">
                            Porte
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {pet.size || "Médio"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
