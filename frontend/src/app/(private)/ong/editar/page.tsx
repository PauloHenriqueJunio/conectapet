"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { Pencil, Trash2, Search } from "lucide-react";

export default function EditarPage() {
  const { token, isLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      if (!isLoading && token) {
        try {
          const data = await apiFetch<Pet[]>("/pets/my-pets", undefined, token);
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
    <div className="max-w-6xl mx-auto">
      {error && (
        <p className="mb-6 rounded-lg bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </p>
      )}

      <div className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Gerenciar Meus Pets
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Edite as informações ou remova os animais cadastrados pela sua ONG.
        </p>
      </div>

      <section className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">
              Nenhum pet encontrado
            </h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              Você ainda não tem animais registrados no sistema. Vá até a aba
              "Cadastrar Pet" para começar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                  <th className="px-6 py-4">Pet</th>
                  <th className="px-6 py-4">Espécie</th>
                  <th className="px-6 py-4">Idade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pets.map((pet) => (
                  <tr
                    key={pet.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          <img
                            src={
                              pet.photoUrl ||
                              "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80"
                            }
                            alt={pet.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-slate-900">
                          {pet.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{pet.species}</td>
                    <td className="px-6 py-4 text-slate-600">{pet.age}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          pet.isAdopted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {pet.isAdopted ? "Adotado" : "Disponível"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Editar Pet"
                          // onClick={() => ...} -> Vamos fazer a navegação aqui
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          title="Excluir Pet"
                          // onClick={() => ...} -> Vamos abrir o modal aqui
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
