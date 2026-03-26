import { AlertCircle } from "lucide-react";

interface HealthChecklistProps {
  isCastrated: boolean;
  isDewormed: boolean;
  hasVaccineV8: boolean;
  hasVaccineRabies: boolean;
  hasHistoryOfIllness: boolean;
  illnessDescription: string;
  hasOtherHealthInfo: boolean;
  otherHealthInfoDescription: string;
  onChange: (field: string, value: boolean | string) => void;
}

export function HealthChecklist({
  isCastrated,
  isDewormed,
  hasVaccineV8,
  hasVaccineRabies,
  hasHistoryOfIllness,
  illnessDescription,
  hasOtherHealthInfo,
  otherHealthInfoDescription,
  onChange,
}: HealthChecklistProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
      <h3 className="text-sm font-semibold text-slate-700">
        Saúde e Histórico
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-emerald-500"
            checked={isCastrated}
            onChange={(e) => onChange("isCastrated", e.target.checked)}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Castrado
          </span>
        </label>

        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-emerald-500"
            checked={isDewormed}
            onChange={(e) => onChange("isDewormed", e.target.checked)}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Vermifugado
          </span>
        </label>

        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-emerald-500"
            checked={hasVaccineV8}
            onChange={(e) => onChange("hasVaccineV8", e.target.checked)}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Vacina Múltipla (V8/V10)
          </span>
        </label>

        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-emerald-500"
            checked={hasVaccineRabies}
            onChange={(e) => onChange("hasVaccineRabies", e.target.checked)}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Vacina Antirrábica
          </span>
        </label>

        <div className="col-span-full mt-2 border-t border-slate-200 pt-4">
          <label className="group flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-emerald-500"
              checked={hasHistoryOfIllness}
              onChange={(e) =>
                onChange("hasHistoryOfIllness", e.target.checked)
              }
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              Possui histórico de doença ou tratamento contínuo?
            </span>
          </label>
          <label className="group flex cursor-pointer items-center gap-3 mt-3">
            <input
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition-colors focus:ring-emerald-500"
              checked={hasOtherHealthInfo}
              onChange={(e) => onChange("hasOtherHealthInfo", e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              Outras informações de saúde relevantes
            </span>
          </label>
        </div>
      </div>

      {hasHistoryOfIllness && (
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Detalhes Médicos
            </span>
          </div>
          <textarea
            id="illnessDescription"
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Ex: Teve cinomose, possui alergia ou faz uso de medicação X..."
            value={illnessDescription}
            onChange={(e) => onChange("illnessDescription", e.target.value)}
            required={hasHistoryOfIllness}
          />
        </div>
      )}

      {hasOtherHealthInfo && (
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-emerald-600">
            <AlertCircle size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Outras Informações
            </span>
          </div>
          <textarea
            id="otherHealthInfoDescription"
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Ex: Alergia a picada de pulga, usa colírio X diariamente, fez cirurgia Y recente..."
            value={otherHealthInfoDescription}
            onChange={(e) =>
              onChange("otherHealthInfoDescription", e.target.value)
            }
            required={hasOtherHealthInfo}
          />
        </div>
      )}
    </div>
  );
}
