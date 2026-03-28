"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import {
  Pencil,
  Trash2,
  Search,
  CalendarDays,
  PawPrint,
  Filter,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FilterStatus = "todos" | "disponiveis" | "adotados";

export default function EditarPage() {
  const { token, isLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("todos");

  useEffect(() => {
    const loadPets = async () => {
      if (!isLoading && token) {
        try {
          const data = await apiFetch<Pet[]>("/pets/my-pets", undefined, token);
          setPets(data);
        } catch {
          setError("Não foi possível carregar seus pets.");
        }
      }
    };
    loadPets();
  }, [token, isLoading]);

  const performActualDelete = async (petId: string) => {
    if (!token) return;
    try {
      await apiFetch(`/pets/${petId}`, { method: "DELETE" }, token);
      setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId));
    } catch (err) {
      setError(
        "Não foi possível excluir o pet. Verifique os pedidos atrelados.",
      );
    }
  };

  const filteredPets = pets.filter((pet) => {
    if (activeFilter === "todos") return true;
    if (activeFilter === "disponiveis") return !pet.isAdopted;
    if (activeFilter === "adotados") return pet.isAdopted;
    return true;
  });

  const counts = {
    todos: pets.length,
    disponiveis: pets.filter((p) => !p.isAdopted).length,
    adotados: pets.filter((p) => p.isAdopted).length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      {error && (
        <p className="mb-6 rounded-lg bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </p>
      )}

      <div className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Gerenciar Meus Pets
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Edite as informações ou remova os animais cadastrados pela sua ONG.
        </p>
      </div>

      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {filteredPets.length === 0 ? (
        <EmptyState isFiltering={activeFilter !== "todos"} />
      ) : (
        <>
          <MobilePetList
            pets={filteredPets}
            onDelete={performActualDelete}
            onEdit={(id) => router.push(`/ong/editar/${id}`)}
          />
          <DesktopPetTable
            pets={filteredPets}
            onDelete={performActualDelete}
            onEdit={(id) => router.push(`/ong/editar/${id}`)}
          />
        </>
      )}
    </div>
  );
}

interface FilterBarProps {
  activeFilter: FilterStatus;
  setActiveFilter: (filter: FilterStatus) => void;
  counts: { todos: number; disponiveis: number; adotados: number };
}

function FilterBar({ activeFilter, setActiveFilter, counts }: FilterBarProps) {
  const filters: { id: FilterStatus; label: string; count: number }[] = [
    { id: "todos", label: "Todos", count: counts.todos },
    { id: "disponiveis", label: "Disponíveis", count: counts.disponiveis },
    { id: "adotados", label: "Adotados", count: counts.adotados },
  ];

  return (
    <div className="mb-6 p-1 rounded-xl bg-slate-100 border border-slate-200 inline-flex items-center gap-1 shadow-inner w-full sm:w-auto flex-wrap sm:flex-nowrap">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap 
              ${
                isActive
                  ? "bg-white text-emerald-700 shadow"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
          >
            {isActive && <Filter size={15} className="text-emerald-500" />}
            {filter.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${isActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-200 text-slate-600"}`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ isFiltering }: { isFiltering: boolean }) {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Search className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900">
          Nenhum pet encontrado
        </h3>
        <p className="text-slate-500 mt-1 max-w-sm">
          {isFiltering
            ? "Nenhum animal cadastrado corresponde ao filtro selecionado no momento."
            : 'Você ainda não tem animais registrados no sistema. Vá até a aba "Cadastrar Pet" para começar.'}
        </p>
      </div>
    </section>
  );
}

function StatusBadge({ isAdopted }: { isAdopted: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${isAdopted ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
    >
      {isAdopted ? "Adotado" : "Disponível"}
    </span>
  );
}

function MobilePetList({
  pets,
  onDelete,
  onEdit,
}: {
  pets: Pet[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="md:hidden space-y-4">
      {pets.map((pet) => (
        <div
          key={`mobile-${pet.id}`}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50 shadow-inner">
              <img
                src={
                  pet.photoUrl ||
                  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80"
                }
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-extrabold text-slate-900 text-lg leading-tight">
                {pet.name}
              </span>
              <StatusBadge isAdopted={pet.isAdopted} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <PawPrint size={16} className="text-emerald-500" />
              <span>
                <strong className="text-slate-900">Espécie:</strong>{" "}
                {pet.species}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarDays size={16} className="text-emerald-500" />
              <span>
                <strong className="text-slate-900">Idade:</strong> {pet.age}{" "}
                anos
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100 mt-4">
            <button
              onClick={() => onEdit(pet.id)}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Pencil size={16} /> Editar
            </button>
            <DeleteButton pet={pet} onDelete={onDelete} isMobile />
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopPetTable({
  pets,
  onDelete,
  onEdit,
}: {
  pets: Pet[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <section className="hidden md:block rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
            <th className="px-6 py-4">Pet</th>
            <th className="px-6 py-4">Espécie</th>
            <th className="px-6 py-4">Idade</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pets.map((pet) => (
            <tr
              key={`table-${pet.id}`}
              className="hover:bg-slate-50/50 transition-colors group animate-in fade-in-30 duration-150"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <img
                      src={
                        pet.photoUrl ||
                        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {pet.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">{pet.species}</td>
              <td className="px-6 py-4 text-slate-600">{pet.age} anos</td>
              <td className="px-6 py-4">
                <StatusBadge isAdopted={pet.isAdopted} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    title="Editar Pet"
                    onClick={() => onEdit(pet.id)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <DeleteButton pet={pet} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function DeleteButton({
  pet,
  onDelete,
  isMobile = false,
}: {
  pet: Pet;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isMobile ? (
          <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100">
            <Trash2 size={16} /> Excluir
          </button>
        ) : (
          <button
            title="Excluir Pet"
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-2xl w-[calc(100%-32px)] sm:w-auto mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-900">
            Você tem certeza absoluta?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o pet{" "}
            <strong className="text-slate-700">{pet.name}</strong> da nossa base
            de dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-lg mt-0">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(pet.id)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors focus:ring-red-500 rounded-lg"
          >
            Sim, excluir pet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
