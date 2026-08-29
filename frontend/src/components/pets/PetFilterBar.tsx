"use client";

import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

const SPECIES_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "Cão", label: "🐶 Cães" },
  { value: "Gato", label: "🐱 Gatos" },
];

interface PetFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;

  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
  activeFiltersCount: number;
  onClearFilters: () => void;

  speciesFilter: string;
  onSpeciesChange: (value: string) => void;

  sizeFilter: string;
  onSizeChange: (value: string) => void;

  sexFilter: string;
  onSexChange: (value: string) => void;

  cityValue: string;
  onCityChange: (value: string) => void;

  castratedFilter: boolean;
  onCastratedChange: (value: boolean) => void;

  vaccinatedFilter: boolean;
  onVaccinatedChange: (value: boolean) => void;
}
export function PetFilterBar({
  searchTerm,
  onSearchTermChange,
  showMoreFilters,
  onToggleMoreFilters,
  activeFiltersCount,
  onClearFilters,
  speciesFilter,
  onSpeciesChange,
  sizeFilter,
  onSizeChange,
  sexFilter,
  onSexChange,
  cityValue,
  onCityChange,
  castratedFilter,
  onCastratedChange,
  vaccinatedFilter,
  onVaccinatedChange,
}: PetFilterBarProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar pet pelo nome..."
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <button
          type="button"
          onClick={onToggleMoreFilters}
          className={`flex shrink-0 items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-bold shadow-sm transition-colors ${
            showMoreFilters
              ? "border-brand-500 bg-brand-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {activeFiltersCount > 0 && (
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                showMoreFilters
                  ? "bg-white text-brand-600"
                  : "bg-brand-600 text-white"
              }`}
            >
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${showMoreFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {showMoreFilters && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Espécie
            </span>
            <div className="flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSpeciesChange(option.value)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                    speciesFilter === option.value
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="size-filter"
                className="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Porte
              </label>
              <select
                id="size-filter"
                value={sizeFilter}
                onChange={(event) => onSizeChange(event.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Todos</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sex-filter"
                className="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Sexo
              </label>
              <select
                id="sex-filter"
                value={sexFilter}
                onChange={(event) => onSexChange(event.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Todos</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="city-filter"
                className="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Cidade
              </label>
              <input
                id="city-filter"
                type="text"
                value={cityValue}
                onChange={(event) => onCityChange(event.target.value)}
                placeholder="Ex: São Paulo"
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={castratedFilter}
                  onChange={(event) => onCastratedChange(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                Castrado
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={vaccinatedFilter}
                  onChange={(event) => onVaccinatedChange(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                Vacinado
              </label>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClearFilters}
                className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
              >
                <X size={14} />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
