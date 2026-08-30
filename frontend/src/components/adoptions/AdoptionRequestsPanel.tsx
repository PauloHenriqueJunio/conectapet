"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Heart, Inbox, PawPrint, Send, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AdoptionRequest } from "@/types/api";
import { AdoptionCard } from "@/components/ui/AdoptionCard";
import { CancelRequestModal } from "./CancelRequestModal";
import { STATUS_COLORS } from "@/constants/theme";

type FilterType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const FILTER_TABS: { id: FilterType; label: string }[] = [
  { id: "ALL", label: "Todas" },
  { id: "PENDING", label: "Em análise" },
  { id: "APPROVED", label: "Aprovadas" },
  { id: "REJECTED", label: "Encerradas" },
];

const HOW_IT_WORKS = [
  {
    title: "Envie sua solicitação",
    desc: "Conte pra ONG por que vocês combinam. Capricho na mensagem ajuda bastante.",
  },
  {
    title: "A ONG analisa o pedido",
    desc: "Normalmente leva de 2 a 5 dias úteis para uma resposta.",
  },
  {
    title: "Você recebe a resposta",
    desc: "Aprovado, combinam os próximos passos. Se não desta vez, siga tentando.",
  },
];

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  tint: "brand" | "amber" | "red";
}) {
  const tintClasses = {
    brand: "bg-brand-100 text-brand-600",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-50 text-red-600",
  }[tint];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tintClasses}`}>
        <Icon size={19} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-extrabold leading-tight text-slate-900">{value}</span>
        <span className="text-[11px] font-semibold text-slate-500">{label}</span>
      </div>
    </div>
  );
}

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
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex flex-col gap-6"
      >
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
            {isOng ? "Painel da ONG" : "Sua jornada de adoção"}
          </span>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
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
              : "Acompanhe em tempo real o andamento dos pets que você quer adotar, do envio até a resposta da ONG."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={Send}
            label={isOng ? "Recebidas" : "Enviadas"}
            value={requests.length}
            tint="brand"
          />
          <StatCard
            icon={Clock}
            label="Em análise"
            value={countByFilter("PENDING")}
            tint="amber"
          />
          <StatCard
            icon={CheckCircle2}
            label="Aprovadas"
            value={countByFilter("APPROVED")}
            tint="brand"
          />
          <StatCard
            icon={Heart}
            label="Novos lares"
            value={countByFilter("APPROVED")}
            tint="red"
          />
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

      <div className={`grid gap-6 ${!isOng ? "lg:grid-cols-[1fr_300px]" : ""}`}>
        <div className="min-w-0">
          <div className="mb-6 flex w-fit flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
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
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center"
              >
                {requests.length === 0 ? (
                  <>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
                      <PawPrint size={36} strokeWidth={1.6} className="text-brand-500" />
                      <Heart
                        size={18}
                        className="absolute right-1 top-2 text-brand-500"
                        fill="currentColor"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {isOng
                        ? "Nenhuma solicitação recebida ainda"
                        : "Sua jornada de adoção começa aqui"}
                    </h3>
                    <p className="max-w-sm text-sm text-slate-500">
                      {isOng
                        ? "Assim que alguém solicitar a adoção de um dos seus pets, ela aparece por aqui."
                        : "Você ainda não enviou nenhuma solicitação. Assim que pedir para adotar um pet, acompanhe cada etapa por aqui."}
                    </p>
                    {!isOng && (
                      <Link
                        href="/pessoa-fisica/home"
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
                      >
                        Explorar pets disponíveis
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Inbox className="h-12 w-12 text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-700">
                      Nenhuma solicitação neste filtro
                    </h3>
                    <p className="max-w-sm text-sm text-slate-500">
                      Experimente outra aba para ver as demais solicitações.
                    </p>
                  </>
                )}
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
        </div>

        {!isOng && (
          <aside className="hidden flex-col gap-5 lg:flex">
            <div className="sticky top-6 flex flex-col gap-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-extrabold text-slate-900">
                  Como funciona o processo
                </h3>
                <div className="flex flex-col gap-4">
                  {HOW_IT_WORKS.map((step, index) => (
                    <div key={step.title} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-xs font-extrabold text-brand-700">
                        {index + 1}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900">{step.title}</span>
                        <span className="text-xs leading-relaxed text-slate-500">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white">
                <Sparkles
                  size={110}
                  className="pointer-events-none absolute -bottom-6 -right-6 text-white/10"
                />
                <p className="relative text-sm font-semibold leading-relaxed">
                  &ldquo;Cada solicitação enviada é um passo mais perto de um novo lar
                  cheio de amor.&rdquo;
                </p>
                <span className="relative mt-3.5 block text-xs font-bold text-brand-100">
                  Equipe ConectaPet
                </span>
              </div>
            </div>
          </aside>
        )}
      </div>

      <CancelRequestModal
        request={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={cancelRequest}
      />
    </div>
  );
}
