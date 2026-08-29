import Link from "next/link";
import {
  Mail,
  UserRound,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Clock,
  Quote,
  PawPrint,
  Building2,
  Calendar,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { AdoptionCardDetails } from "./AdoptionCardDetails";
import { AdoptionRequest } from "@/types/api";

interface AdoptionCardProps {
  request: AdoptionRequest;
  isOng: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onUpdateStatus: (id: string, status: "APPROVED" | "REJECTED") => void;
  onCancel?: (id: string) => void;
}

const STATUS_LABEL: Record<AdoptionRequest["status"], string> = {
  APPROVED: "Aprovada",
  REJECTED: "Não aprovada",
  PENDING: "Em análise",
};

const STATUS_BADGE: Record<AdoptionRequest["status"], string> = {
  APPROVED: "bg-brand-100 text-brand-700 border-brand-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_ICON: Record<AdoptionRequest["status"], typeof CheckCircle2> = {
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  PENDING: Clock,
};

export function AdoptionCard({
  request,
  isOng,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
  onCancel,
}: AdoptionCardProps) {
  const petData = request.pet;
  const isPending = request.status === "PENDING";
  const isApproved = request.status === "APPROVED";
  const isRejected = request.status === "REJECTED";
  const StatusIcon = STATUS_ICON[request.status];

  const cardStyle = isApproved
    ? `bg-brand-50/30 border-brand-100 ${isExpanded ? "shadow-lg border-brand-200" : "hover:shadow-md hover:border-brand-200"}`
    : isRejected
      ? `bg-red-50/30 border-red-100 ${isExpanded ? "shadow-lg border-red-200" : "hover:shadow-md hover:border-red-200"}`
      : `bg-white border-slate-200 ${isExpanded ? "shadow-xl border-brand-200" : "hover:shadow-lg hover:border-brand-200 hover:-translate-y-0.5"}`;

  return (
    <article
      onClick={() => onToggleExpand(request.id)}
      className={`group flex flex-col gap-5 rounded-3xl border p-5 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${cardStyle}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 shadow-sm">
          {petData?.photoUrl ? (
            <img
              src={petData.photoUrl}
              alt={petData.name}
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                request.status !== "PENDING" ? "opacity-90" : ""
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PawPrint size={38} strokeWidth={1.6} className="text-brand-500" />
            </div>
          )}
          <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs shadow-sm">
            {petData?.species === "Gato" ? "🐱" : "🐶"}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h3 className="flex items-center gap-1.5 truncate text-lg font-bold text-slate-900">
              {petData?.name ?? request.petId}
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-brand-600" : ""}`}
              />
            </h3>
            <span
              className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[request.status]}`}
            >
              <StatusIcon size={12} />
              {STATUS_LABEL[request.status]}
            </span>
          </div>

          <div className="mb-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-600">
            {isOng ? (
              <>
                <div className="flex items-center gap-1">
                  <UserRound size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {request.adopter?.name || "Usuário"}
                  </span>
                </div>
                {request.adopter?.email && (
                  <>
                    <span className="mx-0.5 hidden text-slate-300 sm:block">•</span>
                    <a
                      href={`mailto:${request.adopter.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="z-10 flex items-center gap-1 text-brand-600 transition-colors hover:text-brand-700 hover:underline"
                    >
                      <Mail size={14} />
                      {request.adopter.email}
                    </a>
                  </>
                )}
              </>
            ) : (
              petData?.ong?.name && (
                <div className="flex items-center gap-1">
                  <Building2 size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-800">{petData.ong.name}</span>
                </div>
              )
            )}
            <span className="mx-0.5 hidden text-slate-300 sm:block">•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar size={13} />
              {new Date(request.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <p
            className={`relative rounded-xl border border-slate-100 bg-slate-50 py-2 pl-7 pr-3 text-sm text-slate-600 shadow-sm transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}
          >
            <Quote size={14} className="absolute left-2.5 top-2.5 text-slate-300" />
            {request.message}
          </p>
        </div>
      </div>

      {/* Timeline: Enviada -> Em analise -> resultado. Reforca transparencia do
          processo pro adotante e da uma visao rapida do status pra ONG. */}
      <div className="flex items-center border-t border-dashed border-slate-200 pt-4">
        <div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600">
            <Check size={13} strokeWidth={3} className="text-white" />
          </div>
          <span className="text-center text-[10px] font-bold text-slate-500">Enviada</span>
        </div>
        <div className="mb-[18px] h-[3px] flex-1 rounded-full bg-brand-600" />
        <div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 ${isPending ? "ring-4 ring-brand-200" : ""}`}
          >
            {isPending ? (
              <Clock size={13} className="text-white" />
            ) : (
              <Check size={13} strokeWidth={3} className="text-white" />
            )}
          </div>
          <span className="text-center text-[10px] font-bold text-slate-500">Em análise</span>
        </div>
        <div
          className={`mb-[18px] h-[3px] flex-1 rounded-full ${isPending ? "bg-slate-200" : isApproved ? "bg-brand-500" : "bg-red-600"}`}
        />
        <div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full ${
              isPending
                ? "border-2 border-slate-300 bg-white"
                : isApproved
                  ? "bg-brand-600"
                  : "bg-red-600"
            }`}
          >
            {isPending && <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
            {isApproved && <Check size={13} strokeWidth={3} className="text-white" />}
            {isRejected && <X size={12} strokeWidth={3} className="text-white" />}
          </div>
          <span
            className={`text-center text-[10px] font-bold ${
              isPending ? "text-slate-400" : isApproved ? "text-brand-700" : "text-red-700"
            }`}
          >
            {isPending ? "Aguardando" : isApproved ? "Aprovada" : "Encerrada"}
          </span>
        </div>
      </div>

      {isOng && isPending && (
        <div
          className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onUpdateStatus(request.id, "APPROVED")}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95 focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          >
            Aprovar
          </button>
          <button
            onClick={() => onUpdateStatus(request.id, "REJECTED")}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-all hover:bg-red-50 active:scale-95 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            Rejeitar
          </button>
        </div>
      )}

      {!isOng && isPending && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-xs font-medium text-slate-500">
            A ONG costuma responder em 2 a 5 dias úteis.
          </span>
          {onCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(request.id);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
            >
              Cancelar solicitação
            </button>
          )}
        </div>
      )}

      {!isOng && isApproved && (
        <div className="flex items-center gap-2.5 rounded-xl border border-brand-100 bg-brand-50 p-3.5">
          <Sparkles size={17} className="shrink-0 text-brand-600" />
          <span className="text-xs font-semibold text-brand-700">
            A ONG vai entrar em contato para combinar os próximos passos e a visita.
          </span>
        </div>
      )}

      {!isOng && isRejected && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5">
          <span className="text-xs font-semibold text-red-700">
            Desta vez não foi, mas há muitos outros pets à sua espera.
          </span>
          <Link
            href="/pessoa-fisica/home"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-xs font-bold text-red-700 hover:underline"
          >
            Ver outros pets →
          </Link>
        </div>
      )}

      {isOng && isApproved && (
        <div className="flex items-center gap-2.5 rounded-xl border border-brand-100 bg-brand-50 p-3.5">
          <CheckCircle2 size={17} className="shrink-0 text-brand-600" />
          <span className="text-xs font-semibold text-brand-700">
            Solicitação aprovada. Combine os próximos passos com{" "}
            {request.adopter?.name || "o adotante"}.
          </span>
        </div>
      )}

      {isOng && isRejected && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
          <XCircle size={17} className="shrink-0 text-red-600" />
          <span className="text-xs font-semibold text-red-700">Solicitação rejeitada.</span>
        </div>
      )}

      <AdoptionCardDetails petData={petData} isExpanded={isExpanded} />
    </article>
  );
}
