"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { PetForm } from "@/components/ui/PetForm";
import { ArrowLeft } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

export default function EditarPetPessoaFisicaPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user, isLoading: authLoading } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const petId = params.id as string;

  useEffect(() => {
    if (authLoading) return;

    if (user && user.role !== "PESSOA_FISICA") {
      router.replace("/ong/editar");
      return;
    }

    const fetchPet = async () => {
      if (!token) return;

      try {
        const data = await apiFetch<Pet>(`/pets/${petId}`, undefined, token);
        setPet(data);
      } catch {
        setError("Não foi possível carregar os dados deste pet.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, token, authLoading, user, router]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div
        className="mx-auto mt-8 max-w-3xl rounded-2xl border p-6"
        style={{
          backgroundColor: STATUS_COLORS.danger[50],
          borderColor: STATUS_COLORS.danger[200],
          color: STATUS_COLORS.danger[700],
        }}
      >
        <p>{error || "Pet não encontrado."}</p>
        <Link
          href="/pessoa-fisica/meus-pets"
          className="mt-4 inline-flex items-center gap-2 font-semibold underline hover:text-red-900"
        >
          <ArrowLeft size={16} /> Voltar para meus pets
        </Link>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/pessoa-fisica/meus-pets");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-0">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/pessoa-fisica/meus-pets"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition hover:text-brand-700"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Editar pet: {pet.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Atualize dados, fotos e informações de saúde do seu pet.
          </p>
        </div>

        <Link
          href={`/pet/${pet.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        >
          Ver perfil do pet
        </Link>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <PetForm initialData={pet} onSubmitSuccess={handleSuccess} />
      </section>
    </div>
  );
}