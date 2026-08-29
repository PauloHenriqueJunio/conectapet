"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AdoptionRequest } from "@/types/api";
import { AdoptionCard } from "@/components/ui/AdoptionCard";
import { CancelRequestModal } from "./CancelRequestModal";
import { STATUS_COLORS } from "@/constants/theme";

type FilterType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const FILTER_TABS: { id: FilterType; label: string }[] = [
  { id: "ALL", label: "Todas" },
  { id: "PENDING", label: "Pendentes" },
  { id: "APPROVED", label: "Aprovadas" },
  { id: "REJECTED", label: "Rejeitadas" },
];

/** Lista de solicitacoes de adocao, compartilhada entre o dashboard da ONG
 *  (que aprova/rejeita) e "Minhas solicitacoes" da pessoa fisica (que so
 *  acompanha o status). O papel do usuario logado decide o endpoint, o
 *  texto e se os botoes de Aprovar/Rejeitar aparecem. */
export function AdoptionRequestsPanel() {
  const { token, user, isLoading } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [cancelTarget, setCancelTarget] = useState<AdoptionRequest | null>(
    null,
  );

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

  const cancelRequest = async (id: string) => {
    if (!token) return;
    try {
      await apiFetch(
        `/adoptions/${id}`,
        {
          method: "DELETE",
        },
        token,
      );
      setCancelTarget(null);
      await loadData();
    } catch {
      setError("Não foi possível cancelar a solicitação.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRequestId((prev) => (prev === id ? null : id));
  };

  const filteredRequests = useMemo(() => {
    if (activeFilter === "ALL") return requests;
    return requests.filter((req) => req.status === activeFilter);
  }, [requests, activeFilter]);

  const countByFilter = (filter: FilterType) =>
    filter === "ALL"
      ? requests.length
      : requests.filter((req) => req.status === filter).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {isOng ? (
              "Gestão de Adoções"
            ) : (
              <>
                Minhas{" "}
                <span className="text-brand-600">solicitações de adoção</span>
              </>
            )}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isOng
              ? "Analise as solicitações de adoção recebidas para os seus pets."
              : "Acompanhe em tempo real o andamento dos pets que você quer adotar."}
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 rounded-2xl border p-4 text-sm shadow-sm"
          style={{
            backgroundColor: STATUS_COLORS.danger[50],
            borderColor: STATUS_COLORS.danger[200],
            color: STATUS_COLORS.danger[700],
          }}
        >
          {error}
        </motion.div>
      )}

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              activeFilter === tab.id
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {tab.label}
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                activeFilter === tab.id
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {countByFilter(tab.id)}
            </span>
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-4 pb-10">
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center"
          >
            <Inbox className="mb-4 h-14 w-14 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700">
              Nenhuma solicitação encontrada
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              {isOng
                ? "Assim que alguém solicitar a adoção de um dos seus pets, ela aparece por aqui."
                : "Assim que você solicitar a adoção de um pet, o andamento aparece por aqui."}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <AdoptionCard
                  request={request}
                  isOng={isOng}
                  isExpanded={request.id === expandedRequestId}
                  onToggleExpand={toggleExpand}
                  onUpdateStatus={updateStatus}
                  onCancel={() => setCancelTarget(request)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </section>

      <CancelRequestModal
        request={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={cancelRequest}
      />
    </div>
  );
}
