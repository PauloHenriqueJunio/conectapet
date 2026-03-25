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
    if (!token || !user) return;

    try {
      const endpoint =
        user.role === "ONG"
          ? "/adoptions/ong-requests"
          : "/adoptions/my-requests";
      const data = await apiFetch<AdoptionRequest[]>(
        endpoint,
        undefined,
        token,
      );
      setRequests(data);
    } catch {
      setError("Falha ao carregar as solicitações.");
    }
  };

  useEffect(() => {
    if (!isLoading) loadData();
  }, [token, user, isLoading]);

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (!token) return;

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
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto w-full flex-grow p-4">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-8 border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isOng ? "Gestão de Adoções" : "Minhas Solicitações de Adoção"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isOng
              ? "Analise as solicitações de adoção recebidas para os seus pets."
              : "Acompanhe o status dos pets que você deseja adotar."}
          </p>
        </div>

        <section className="flex flex-col gap-4">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500">
              Nenhuma solicitação encontrada no momento.
            </div>
          ) : (
            requests.map((request) => (
              <article
                key={request.id}
                className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:items-center"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-inner">
                  <img
                    src={
                      request.pet?.photoUrl ||
                      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={`Foto de ${request.pet?.name || "Pet"}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {request.pet?.name ?? request.petId}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                      {request.pet?.species ?? "N/A"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        request.status === "APPROVED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : request.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium text-slate-800 truncate">
                      {request.adopter?.name || "Usuário"}
                    </span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span>
                      {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-md border border-slate-100">
                    <span className="font-medium text-slate-400 mr-1">
                      Mensagem:
                    </span>
                    "{request.message}"
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32 mt-3 sm:mt-0">
                  {isOng && request.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, "APPROVED")}
                        className="flex-1 sm:flex-none w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, "REJECTED")}
                        className="flex-1 sm:flex-none w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        Rejeitar
                      </button>
                    </>
                  ) : (
                    <div className="hidden sm:flex h-full items-center justify-end">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                        {request.status === "PENDING"
                          ? "Aguardando"
                          : "Concluído"}
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
  );
}
