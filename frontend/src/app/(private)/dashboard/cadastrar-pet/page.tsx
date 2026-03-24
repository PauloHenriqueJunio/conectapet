"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CadastrarPetPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [petForm, setPetForm] = useState({
    name: "",
    species: "",
    age: 0,
    description: "",
    photoUrl: "",
  });

  const handleAddPet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await apiFetch(
        "/pets",
        {
          method: "POST",
          body: JSON.stringify(petForm),
        },
        token,
      );

      setSuccess("Pet adicionado com sucesso!");
      setPetForm({
        name: "",
        species: "",
        age: 0,
        description: "",
        photoUrl: "",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("Não foi possível adicionar o pet.");
    }
  };

  return (
    <>
      {error && (
        <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-lg bg-green-100 px-3 py-2 text-green-700">
          {success}
        </p>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Adicionar Pet</h2>
        <form onSubmit={handleAddPet} className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-lg border border-slate-300 p-2 outline-none ring-brand-300 focus:ring"
            placeholder="Nome"
            value={petForm.name}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            className="rounded-lg border border-slate-300 p-2 outline-none ring-brand-300 focus:ring"
            placeholder="Espécie"
            value={petForm.species}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, species: e.target.value }))
            }
            required
          />
          <input
            className="rounded-lg border border-slate-300 p-2 outline-none ring-brand-300 focus:ring"
            type="number"
            min={0}
            placeholder="Idade"
            value={petForm.age}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, age: Number(e.target.value) }))
            }
            required
          />
          <input
            className="rounded-lg border border-slate-300 p-2 outline-none ring-brand-300 focus:ring"
            placeholder="URL da foto (opcional)"
            value={petForm.photoUrl}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, photoUrl: e.target.value }))
            }
          />
          <textarea
            className="rounded-lg border border-slate-300 p-2 outline-none ring-brand-300 focus:ring md:col-span-2"
            placeholder="Descrição"
            value={petForm.description}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700 md:col-span-2"
          >
            Salvar Pet
          </button>
        </form>
      </section>
    </>
  );
}
