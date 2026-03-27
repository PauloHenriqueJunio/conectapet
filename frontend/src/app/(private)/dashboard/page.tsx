"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AdoptionRequest } from "@/types/api";
import {
  Mail,
  UserRound,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

type FilterType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const HealthBadge = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "success" | "warning";
}) => {
  const styles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

export default function DashboardPage() {
  const { token, user, isLoading } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const filteredRequests = useMemo(() => {
    if (activeFilter === "ALL") return requests;
    return requests.filter((req) => req.status === activeFilter);
  }, [requests, activeFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm animate-in fade-in duration-300">
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

      <section className="flex flex-col gap-4">
        {filteredRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500">
            Nenhuma solicitação encontrada para este filtro.
          </div>
        ) : (
          filteredRequests.map((request) => {
            const cardStyle =
              request.status === "APPROVED"
                ? "bg-emerald-50/30 border-emerald-100"
                : request.status === "REJECTED"
                  ? "bg-red-50/30 border-red-100"
                  : "bg-white border-slate-200 hover:shadow-md";

            // Atalho para acessar os dados do pet de forma mais segura
            const petData = request.pet;

            return (
              <article
                key={request.id}
                className={`group flex flex-col sm:flex-row gap-4 rounded-xl border p-4 transition-all sm:items-center ${cardStyle}`}
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner">
                  {/* --- CORREÇÃO DA IMAGEM AQUI --- */}
                  <img
                    // Usando as chaves {} corretas e caindo no fallback se não houver photoUrl
                    src={
                      petData?.photoUrl ||
                      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={petData?.name || "Pet"}
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      request.status !== "PENDING" ? "opacity-90" : ""
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {petData?.name ?? request.petId}
                    </h3>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                      {petData?.species ?? "N/A"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        request.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : request.status === "REJECTED"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mb-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <div className="flex items-center gap-1">
                      <UserRound size={14} className="text-slate-400" />
                      <span className="font-medium text-slate-800">
                        {request.adopter?.name || "Usuário"}
                      </span>
                    </div>

                    {request.adopter?.email && (
                      <>
                        <span className="text-slate-300 mx-0.5 hidden sm:block">
                          •
                        </span>
                        <a
                          href={`mailto:${request.adopter.email}`}
                          className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
                        >
                          <Mail size={14} />
                          {request.adopter.email}
                        </a>
                      </>
                    )}

                    <span className="text-slate-300 mx-0.5 hidden sm:block">
                      •
                    </span>
                    <span className="text-slate-500">
                      {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  {/* --- NOVA SEÇÃO DE SAÚDE AQUI --- */}
                  {petData && (
                    <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 shadow-inner">
                      <div className="flex items-center gap-2 mb-2 text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span className="text-xs font-semibold tracking-wider uppercase">
                          Visão Geral de Saúde
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {/* Universais */}
                        {petData.isCastrated && (
                          <HealthBadge label="Castrado" />
                        )}
                        {petData.isDewormed && (
                          <HealthBadge label="Vermifugado" />
                        )}
                        {petData.hasVaccineRabies && (
                          <HealthBadge
                            label="Vacina Antirrábica"
                            variant="success"
                          />
                        )}

                        {/* Cães */}
                        {petData.species === "Cão" && (
                          <>
                            {petData.hasVaccineV8 && (
                              <HealthBadge label="V8/V10" variant="success" />
                            )}
                            {petData.hasVaccineGiardia && (
                              <HealthBadge label="Giárdia" variant="success" />
                            )}
                            {petData.hasVaccineFlu && (
                              <HealthBadge
                                label="Gripe Canina"
                                variant="success"
                              />
                            )}
                          </>
                        )}

                        {/* Gatos */}
                        {petData.species === "Gato" && (
                          <>
                            {petData.hasVaccineFeline && (
                              <HealthBadge label="V3/V4/V5" variant="success" />
                            )}
                            {petData.hasVaccineFelv && (
                              <HealthBadge label="FeLV" variant="success" />
                            )}
                          </>
                        )}

                        {/* Alerta de Histórico Clínico */}
                        {petData.hasHistoryOfIllness && (
                          <HealthBadge
                            label="Histórico de Saúde"
                            variant="warning"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-500 line-clamp-2 bg-white/60 p-2 rounded-md border border-slate-100 shadow-sm">
                    <span className="font-medium text-slate-400 mr-1">
                      Mensagem:
                    </span>
                    "{request.message}"
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32 mt-3 sm:mt-0 items-center justify-center">
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
                    <div className="hidden sm:flex flex-col items-center justify-center h-full w-full">
                      {request.status === "APPROVED" ? (
                        <div className="flex flex-col items-center text-emerald-600/70">
                          <CheckCircle2 className="w-8 h-8" />
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                            Concluído
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-red-500/60">
                          <XCircle className="w-8 h-8" />
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                            Encerrado
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
