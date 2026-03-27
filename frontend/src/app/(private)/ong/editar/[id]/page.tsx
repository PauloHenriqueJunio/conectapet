"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";

export default function EditarPetPage() {
  const params = useParams(); // Pega o ID lá da URL
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const petId = params.id as string;

  useEffect(() => {
    const fetchPet = async () => {
      if (!token || authLoading) return;

      try {
        // Busca os dados do pet específico no seu NestJS
        const data = await apiFetch<Pet>(`/pets/${petId}`, undefined, token);
        setPet(data);
      } catch (err) {
        setError("Não foi possível carregar os dados deste pet.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, token, authLoading]);

  if (loading || authLoading) {
    return <div className="p-6">Carregando dados do pet...</div>;
  }

  if (error || !pet) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <p>{error || "Pet não encontrado."}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 underline font-semibold"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 border-b border-slate-200 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Editar Pet: {pet.name}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Atualize as informações, fotos ou histórico de saúde.
          </p>
        </div>
        <button
          onClick={() => router.push("/ong/editar")}
          className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* AQUI VAI ENTRAR O SEU FORMULÁRIO DE CADASTRO REAPROVEITADO */}
        <p className="text-emerald-600 font-semibold animate-pulse">
          Dados do {pet.name} carregados com sucesso! Preparando o formulário...
        </p>
      </div>
    </div>
  );
}
