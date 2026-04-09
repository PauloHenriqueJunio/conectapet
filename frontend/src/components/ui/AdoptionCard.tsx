import { AdoptionRequest } from "@/types/api";
import {
  Mail,
  UserRound,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { AdoptionCardDetails } from "./AdoptionCardDetails";
import { BRAND_COLORS, STATUS_COLORS } from "@/constants/theme";

interface AdoptionCardProps {
  request: AdoptionRequest;
  isOng: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onUpdateStatus: (id: string, status: "APPROVED" | "REJECTED") => void;
}

export function AdoptionCard({
  request,
  isOng,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
}: AdoptionCardProps) {
  const petData = request.pet;

  const statusStyles: Record<AdoptionRequest["status"], React.CSSProperties> = {
    APPROVED: {
      backgroundColor: BRAND_COLORS[100],
      color: BRAND_COLORS[700],
      borderColor: BRAND_COLORS[200],
    },
    REJECTED: {
      backgroundColor: STATUS_COLORS.danger[100],
      color: STATUS_COLORS.danger[700],
      borderColor: STATUS_COLORS.danger[200],
    },
    PENDING: {
      backgroundColor: STATUS_COLORS.warning[100],
      color: STATUS_COLORS.warning[700],
      borderColor: STATUS_COLORS.warning[200],
    },
  };

  const cardStyle =
    request.status === "APPROVED"
      ? `bg-brand-50/30 border-brand-100 ${isExpanded ? "shadow-lg border-brand-200" : ""}`
      : request.status === "REJECTED"
        ? `bg-red-50/30 border-red-100 ${isExpanded ? "shadow-lg border-red-200" : ""}`
        : `bg-white border-slate-200 hover:shadow-md ${isExpanded ? "shadow-xl border-brand-200" : ""}`;

  return (
    <article
      onClick={() => onToggleExpand(request.id)}
      className={`group flex flex-col gap-4 rounded-xl border p-4 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${cardStyle}`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner">
          <img
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
            <h3 className="truncate text-lg font-bold text-slate-900 flex items-center gap-1.5">
              {petData?.name ?? request.petId}
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-brand-600" : ""}`}
              />
            </h3>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
              {petData?.species ?? "N/A"}
            </span>
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-bold"
              style={statusStyles[request.status]}
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
                <span className="text-slate-300 mx-0.5 hidden sm:block">•</span>
                <a
                  href={`mailto:${request.adopter.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 transition-colors z-10"
                >
                  <Mail size={14} />
                  {request.adopter.email}
                </a>
              </>
            )}

            <span className="text-slate-300 mx-0.5 hidden sm:block">•</span>
            <span className="text-slate-500">
              {new Date(request.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <p
            className={`text-sm text-slate-500 bg-white/60 p-2 rounded-md border border-slate-100 shadow-sm transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}
          >
            <span className="font-medium text-slate-400 mr-1">Mensagem:</span>"
            {request.message}"
          </p>
        </div>
        <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32 mt-3 sm:mt-0 items-center justify-center">
          {isOng && request.status === "PENDING" ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(request.id, "APPROVED");
                }}
                className="flex-1 sm:flex-none w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 z-10"
              >
                Aprovar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(request.id, "REJECTED");
                }}
                className="flex-1 sm:flex-none w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-1 z-10"
              >
                Rejeitar
              </button>
            </>
          ) : (
            <div className="hidden sm:flex flex-col items-center justify-center h-full w-full">
              {request.status === "APPROVED" ? (
                <div className="flex flex-col items-center text-brand-600/70">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1 whitespace-nowrap">
                    Concluído
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-red-500/60">
                  <XCircle className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1 whitespace-nowrap">
                    Encerrado
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AdoptionCardDetails petData={petData} isExpanded={isExpanded} />
    </article>
  );
}
