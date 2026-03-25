interface HealthChecklistProps {
  isCastrated: boolean;
  isDewormed: boolean;
  hasVaccineV8: boolean;
  hasVaccineRabies: boolean;
  onChange: (field: string, value: boolean) => void;
}

export function HealthChecklist({
  isCastrated,
  isDewormed,
  hasVaccineV8,
  hasVaccineRabies,
  onChange,
}: HealthChecklistProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
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
      </div>
    </div>
  );
}
