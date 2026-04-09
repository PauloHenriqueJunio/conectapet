"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AdoptionRequest } from "@/types/api";
import { AdoptionCard } from "@/components/ui/AdoptionCard";
import { STATUS_COLORS } from "@/constants/theme";

type FilterType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function DashboardPage() {
  const { token, user, isLoading } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

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

  const toggleExpand = (id: string) => {
    setExpandedRequestId((prev) => (prev === id ? null : id));
  };

  const filteredRequests = useMemo(() => {
    if (activeFilter === "ALL") return requests;
    return requests.filter((req) => req.status === activeFilter);
  }, [requests, activeFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {error && (
        <div
          className="mb-6 rounded-lg border p-4 text-sm shadow-sm animate-in fade-in duration-300"
          style={{
            backgroundColor: STATUS_COLORS.danger[50],
            borderColor: STATUS_COLORS.danger[200],
            color: STATUS_COLORS.danger[700],
          }}
        >
          {error}
        </div>
      )}

      <div className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isOng ? "Gestão de Adoções" : "Minhas Solicitações de Adoção"}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isOng
            ? "Analise as solicitações de adoção recebidas para os seus pets."
            : "Acompanhe o status dos pets que você deseja adotar."}
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(
          [
            { id: "ALL", label: "Todas" },
            { id: "PENDING", label: "Pendentes" },
            { id: "APPROVED", label: "Aprovadas" },
            { id: "REJECTED", label: "Rejeitadas" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeFilter === tab.id
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            {tab.id === "ALL" && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  activeFilter === tab.id
                    ? "bg-slate-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {requests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-4 pb-10">
        {filteredRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500">
            Nenhuma solicitação encontrada para este filtro.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <AdoptionCard
              key={request.id}
              request={request}
              isOng={isOng}
              isExpanded={request.id === expandedRequestId}
              onToggleExpand={toggleExpand}
              onUpdateStatus={updateStatus}
            />
          ))
        )}
      </section>
    </div>
  );
}
