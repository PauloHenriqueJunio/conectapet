import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { STATUS_COLORS } from "@/constants/theme";
import { AdoptionRequest } from "@/types/api";

interface AdoptionCardDetailsProps {
  petData: AdoptionRequest["pet"];
  isExpanded: boolean;
}

export function AdoptionCardDetails({
  petData,
  isExpanded,
}: AdoptionCardDetailsProps) {
  if (!petData) return null;

  const hasAnyVaccine =
    petData.hasVaccineRabies ||
    (petData.species === "Cão" &&
      (petData.hasVaccineV8 || petData.hasVaccineGiardia || petData.hasVaccineFlu)) ||
    (petData.species === "Gato" &&
      (petData.hasVaccineFeline || petData.hasVaccineFelv));

  return (
    <div
      className={`col-span-full border-t border-slate-100 transition-all duration-500 ease-in-out ${
        isExpanded
          ? "max-h-[1000px] pt-5 opacity-100"
          : "max-h-0 pt-0 opacity-0"
      }`}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* carteira de vacinacao, sempre em primeiro */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 md:col-span-full shadow-inner">
          <div className="flex items-center gap-2.5 mb-4 text-slate-500">
            <ShieldCheck size={18} className="text-brand-600" />
            <span className="text-sm font-semibold text-slate-800">
              Carteira de Vacinação
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {!hasAnyVaccine && (
              <div className="group relative flex w-max cursor-help items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400">
                <span className="line-through opacity-70">
                  Nenhuma vacina registrada
                </span>
                <Info size={13} className="text-slate-300" />

                <div className="absolute left-0 bottom-full mb-2 hidden w-64 -translate-x-2 flex-col rounded-xl bg-slate-900 px-3 py-2.5 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:flex group-hover:opacity-100 z-10 pointer-events-none">
                  <span className="font-bold text-brand-400 mb-1">
                    Sem vacinas cadastradas
                  </span>
                  <span className="leading-relaxed text-[#cbd5e1]">
                    O responsável ainda não informou vacinas para este pet.
                    Converse com a ONG ou tutor para confirmar o histórico de
                    saúde antes de seguir com a adoção.
                  </span>

                  <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-slate-900"></div>
                </div>
              </div>
            )}

            {petData.isCastrated && (
              <HealthBadge label="Castrado" isLarge variant="default" />
            )}
            {petData.isDewormed && (
              <HealthBadge label="Vermifugado" isLarge variant="default" />
            )}
            {petData.hasVaccineRabies && (
              <HealthBadge
                label="Vacina Antirrábica Completa"
                isLarge
                variant="success"
              />
            )}

            {petData.species === "Cão" && (
              <>
                {petData.hasVaccineV8 && (
                  <HealthBadge
                    label="Múltipla Canina (V8/V10)"
                    isLarge
                    variant="success"
                  />
                )}
                {petData.hasVaccineGiardia && (
                  <HealthBadge
                    label="Vacina contra Giárdia"
                    isLarge
                    variant="success"
                  />
                )}
                {petData.hasVaccineFlu && (
                  <HealthBadge
                    label="Vacina Gripe Canina"
                    isLarge
                    variant="success"
                  />
                )}
              </>
            )}

            {petData.species === "Gato" && (
              <>
                {petData.hasVaccineFeline && (
                  <HealthBadge
                    label="Múltipla Felina (V3/V4/V5)"
                    isLarge
                    variant="success"
                  />
                )}
                {petData.hasVaccineFelv && (
                  <HealthBadge
                    label="Leucemia (FeLV)"
                    isLarge
                    variant="success"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* hist clinico detalhado */}
        {petData.hasHistoryOfIllness && (
          <div
            className="rounded-xl border p-5 shadow-inner"
            style={{
              backgroundColor: STATUS_COLORS.warning[50],
              borderColor: STATUS_COLORS.warning[100],
            }}
          >
            <div
              className="mb-3 flex items-center gap-2"
              style={{ color: STATUS_COLORS.warning[700] }}
            >
              <AlertTriangle size={16} />
              <span className="font-semibold text-sm">
                Detalhamento do Histórico Clínico
              </span>
            </div>
            <p
              className="rounded-lg border bg-white/70 p-4 text-sm whitespace-pre-wrap leading-relaxed shadow-sm"
              style={{
                borderColor: STATUS_COLORS.warning[100],
                color: STATUS_COLORS.warning[950],
              }}
            >
              "{petData.illnessDescription || "Não informado."}"
            </p>
          </div>
        )}

        {/* outras informacoess */}
        {petData.hasOtherHealthInfo && (
          <div className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <Info size={16} />
              <span className="font-semibold text-sm">
                Outras Informações Importantes
              </span>
            </div>
            <p className="text-sm text-slate-950 bg-white/70 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed shadow-sm">
              "{petData.otherHealthInfoDescription || "Não informado."}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
