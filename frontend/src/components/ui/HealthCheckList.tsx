import { AlertCircle } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

interface HealthChecklistProps {
  species: string;
  isCastrated: boolean;
  isDewormed: boolean;
  hasVaccineV8: boolean;
  hasVaccineGiardia: boolean;
  hasVaccineFlu: boolean;
  hasVaccineFeline: boolean;
  hasVaccineFelv: boolean;
  hasVaccineRabies: boolean;
  hasHistoryOfIllness: boolean;
  illnessDescription: string;
  hasOtherHealthInfo: boolean;
  otherHealthInfoDescription: string;
  onChange: (field: string, value: boolean | string) => void;
}

export function HealthChecklist({ species, ...props }: HealthChecklistProps) {
  const showDogVaccines =
    species === "Cão" || species === "Outros" || species === "";
  const showCatVaccines =
    species === "Gato" || species === "Outros" || species === "";
  const showUniversal =
    species === "Cão" ||
    species === "Gato" ||
    species === "Outros" ||
    species === "";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
      <h3 className="text-sm font-semibold text-slate-700">
        Saúde e Histórico
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* universais */}
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
            checked={props.isCastrated}
            onChange={(e) => props.onChange("isCastrated", e.target.checked)}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Castrado
          </span>
        </label>

        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
            checked={props.isDewormed}
            onChange={(e) => props.onChange("isDewormed", e.target.checked)}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Vermifugado
          </span>
        </label>

        {showUniversal && (
          <label className="group flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
              checked={props.hasVaccineRabies}
              onChange={(e) =>
                props.onChange("hasVaccineRabies", e.target.checked)
              }
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900">
              Vacina Antirrábica
            </span>
          </label>
        )}

        {/* vacinas de cães */}
        {showDogVaccines && (
          <>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
                checked={props.hasVaccineV8}
                onChange={(e) =>
                  props.onChange("hasVaccineV8", e.target.checked)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                Vacina Múltipla Canina (V8/V10)
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
                checked={props.hasVaccineGiardia}
                onChange={(e) =>
                  props.onChange("hasVaccineGiardia", e.target.checked)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                Vacina Giárdia
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
                checked={props.hasVaccineFlu}
                onChange={(e) =>
                  props.onChange("hasVaccineFlu", e.target.checked)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                Vacina Gripe Canina
              </span>
            </label>
          </>
        )}

        {/* vacinas de gatos */}
        {showCatVaccines && (
          <>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
                checked={props.hasVaccineFeline}
                onChange={(e) =>
                  props.onChange("hasVaccineFeline", e.target.checked)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                Vacina Múltipla Felina (V3/V4/V5)
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
                checked={props.hasVaccineFelv}
                onChange={(e) =>
                  props.onChange("hasVaccineFelv", e.target.checked)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                Vacina Leucemia (FeLV)
              </span>
            </label>
          </>
        )}

        <div className="col-span-full mt-2 border-t border-slate-200 pt-4">
          <label className="group flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
              checked={props.hasHistoryOfIllness}
              onChange={(e) =>
                props.onChange("hasHistoryOfIllness", e.target.checked)
              }
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              Possui histórico de doença ou tratamento contínuo?
            </span>
          </label>
          <label className="group flex cursor-pointer items-center gap-3 mt-3">
            <input
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 transition-colors focus:ring-brand-500"
              checked={props.hasOtherHealthInfo}
              onChange={(e) =>
                props.onChange("hasOtherHealthInfo", e.target.checked)
              }
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              Outras informações de saúde relevantes
            </span>
          </label>
        </div>
      </div>

      {props.hasHistoryOfIllness && (
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className="flex items-center gap-2"
            style={{ color: STATUS_COLORS.warning[700] }}
          >
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
            value={props.illnessDescription}
            onChange={(e) =>
              props.onChange("illnessDescription", e.target.value)
            }
            required={props.hasHistoryOfIllness}
          />
        </div>
      )}

      {props.hasOtherHealthInfo && (
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-brand-600">
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
            value={props.otherHealthInfoDescription}
            onChange={(e) =>
              props.onChange("otherHealthInfoDescription", e.target.value)
            }
            required={props.hasOtherHealthInfo}
          />
        </div>
      )}
    </div>
  );
}
