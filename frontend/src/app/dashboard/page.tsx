"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AdoptionRequest, Pet } from "@/types/api";

export default function DashboardPage() {
  const { token, user, logout, isLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [petForm, setPetForm] = useState({
    name: "",
    species: "",
    age: 0,
    description: "",
    photoUrl: "",
  });

  const isOng = useMemo(() => user?.role === "ONG", [user?.role]);

  const loadData = async () => {
    if (!token || !user) {
      return;
    }

    try {
      if (user.role === "ONG") {
        const [myPets, ongRequests] = await Promise.all([
          apiFetch<Pet[]>("/pets/my-pets", undefined, token),
          apiFetch<AdoptionRequest[]>(
            "/adoptions/ong-requests",
            undefined,
            token,
          ),
        ]);
        setPets(myPets);
        setRequests(ongRequests);
      } else {
        const myRequests = await apiFetch<AdoptionRequest[]>(
          "/adoptions/my-requests",
          undefined,
          token,
        );
        setRequests(myRequests);
      }
    } catch {
      setError("Falha ao carregar o dashboard.");
    }
  };

  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [token, user, isLoading]);

  const handleAddPet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    try {
      await apiFetch(
        "/pets",
        {
          method: "POST",
          body: JSON.stringify(petForm),
        },
        token,
      );

      setPetForm({
        name: "",
        species: "",
        age: 0,
        description: "",
        photoUrl: "",
      });
      await loadData();
    } catch {
      setError("Não foi possível adicionar o pet.");
    }
  };

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (!token) {
      return;
    }

    try {
      await apiFetch(
        `/adoptions/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        token,
      );
      await loadData();
    } catch {
      setError("Não foi possível atualizar o status da solicitação.");
    }
  };

  if (isLoading) {
    return <main className="p-6">Carregando...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600">
            Olá, {user?.name}. Perfil: {user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg bg-slate-800 px-4 py-2 text-white"
        >
          Sair
        </button>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-red-700">
          {error}
        </p>
      )}

      {isOng && (
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">Adicionar Pet</h2>
          <form onSubmit={handleAddPet} className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-lg border p-2"
              placeholder="Nome"
              value={petForm.name}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <input
              className="rounded-lg border p-2"
              placeholder="Espécie"
              value={petForm.species}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, species: e.target.value }))
              }
              required
            />
            <input
              className="rounded-lg border p-2"
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
              className="rounded-lg border p-2"
              placeholder="URL da foto (opcional)"
              value={petForm.photoUrl}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, photoUrl: e.target.value }))
              }
            />
            <textarea
              className="rounded-lg border p-2 md:col-span-2"
              placeholder="Descrição"
              value={petForm.description}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
            <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white md:col-span-2">
              Salvar Pet
            </button>
          </form>
        </section>
      )}

      {isOng && (
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">Meus Pets</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Nome</th>
                  <th>Espécie</th>
                  <th>Idade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id} className="border-b">
                    <td className="py-2">{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.age}</td>
                    <td>{pet.isAdopted ? "Adotado" : "Disponível"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">
          {isOng ? "Solicitações recebidas" : "Minhas solicitações"}
        </h2>
        <div className="space-y-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-xl border p-4">
              <p className="font-semibold">
                Pet: {request.pet?.name ?? request.petId} (
                {request.pet?.species ?? "N/A"})
              </p>
              <p className="text-sm text-slate-600">
                Mensagem: {request.message}
              </p>
              <p className="text-sm">Status: {request.status}</p>
              {isOng && request.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(request.id, "APPROVED")}
                    className="rounded-lg bg-green-600 px-3 py-1 text-sm font-semibold text-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => updateStatus(request.id, "REJECTED")}
                    className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white"
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
