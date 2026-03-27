"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { PetForm } from "@/components/ui/PetForm";

export default function EditarPetPage() {
  const params = useParams();
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

  const handleSuccess = () => {
    router.push("/ong/editar");
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <p>{error || "Pet não encontrado."}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 underline font-semibold hover:text-red-900 transition-colors"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-0">
      <div className="mb-6 border-b border-slate-200 pb-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
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
          className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
        >
          Cancelar e Voltar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <PetForm initialData={pet} onSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}
