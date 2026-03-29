"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Pet } from "@/types/api";

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState("");

  useEffect(() => {
    const loadPets = async () => {
      try {
        const query = speciesFilter
          ? `?species=${encodeURIComponent(speciesFilter)}`
          : "";
        const data = await apiFetch<Pet[]>(`/pets${query}`);
        setPets(data);
      } catch {
        setError("Não foi possível carregar os pets no momento.");
      }
    };

    loadPets();
  }, [speciesFilter]);

  return (
    <body>
      <SiteHeader page="home" variant="public" />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            Filtrar por espécie
          </label>
          <input
            value={speciesFilter}
            onChange={(event) => setSpeciesFilter(event.target.value)}
            placeholder="Ex: Cão, Gato"
            className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none ring-brand-300 focus:ring"
          />
        </section>

        {error && (
          <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-red-700">
            {error}
          </p>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {pet.species}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {pet.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Idade: {pet.age} anos
              </p>
              <p className="mt-3 text-sm text-slate-700">{pet.description}</p>
            </article>
          ))}
        </section>

        <SiteFooter />
      </main>
    </body>
  );
}
