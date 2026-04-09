import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { STATUS_COLORS } from "@/constants/theme";

interface AdoptionCardDetailsProps {
  petData: any;
  isExpanded: boolean;
}

export function AdoptionCardDetails({
  petData,
  isExpanded,
}: AdoptionCardDetailsProps) {
  if (!petData) return null;

  return (
    <div
      className={`col-span-full border-t border-slate-100 transition-all duration-500 ease-in-out ${
        isExpanded
          ? "max-h-[1000px] pt-5 opacity-100"
          : "max-h-0 pt-0 opacity-0"
      }`}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

        {/* a parte da ampliação*/}
        <div className="rounded-xl border border-slate-100 bg-white p-5 md:col-span-full shadow-inner">
          <div className="flex items-center gap-2.5 mb-4 text-slate-500">
            <ShieldCheck size={18} className="text-brand-600" />
            <span className="text-sm font-semibold text-slate-800">
              Carteira de Vacinação
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
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
      </div>
    </div>
  );
}
