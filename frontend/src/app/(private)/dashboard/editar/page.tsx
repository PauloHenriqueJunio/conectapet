"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";

export default function EditarPage() {
  const { token, isLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      if (!isLoading && token) {
        try {
          const data = await apiFetch<Pet[]>(
            "/pets/my-pets",
            undefined,
            token,
          );
          setPets(data);
        } catch {
          setError("Não foi possível carregar seus pets.");
        }
      }
    };

    loadPets();
  }, [token, isLoading]);

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Meus Pets</h2>
        {pets.length === 0 ? (
          <p className="text-slate-600">
            Você não tem pets registrados ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Espécie</th>
                  <th className="px-4 py-3">Idade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{pet.name}</td>
                    <td className="px-4 py-3">{pet.species}</td>
                    <td className="px-4 py-3">{pet.age}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          pet.isAdopted
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {pet.isAdopted ? "Adotado" : "Disponível"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-700">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
