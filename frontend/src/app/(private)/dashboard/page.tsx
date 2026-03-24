"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AdoptionRequest } from "@/types/api";

export default function DashboardPage() {
  const { token, user, isLoading } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isOng = useMemo(() => user?.role === "ONG", [user?.role]);

  const loadData = async () => {
    if (!token || !user) {
      return;
    }

    try {
      if (user.role === "ONG") {
        const ongRequests = await apiFetch<AdoptionRequest[]>(
          "/adoptions/ong-requests",
          undefined,
          token,
        );
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
      setError("Falha ao carregar as solicitações.");
    }
  };

  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [token, user, isLoading]);

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
    </>
  );
}
