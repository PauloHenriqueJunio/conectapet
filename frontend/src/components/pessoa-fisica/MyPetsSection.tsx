"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
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
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Filter,
  PawPrint,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

type FilterStatus = "todos" | "disponiveis" | "adotados";

export function MyPetsSection() {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("todos");

  useEffect(() => {
    if (isLoading) return;

    if (user && user.role !== "PESSOA_FISICA") {
      router.replace("/ong/editar");
      return;
    }

    const loadPets = async () => {
      if (!token) return;

      try {
        const data = await apiFetch<Pet[]>("/pets/my-pets", undefined, token);
        setPets(data);
      } catch {
        setError("Não foi possível carregar seus pets cadastrados.");
      }
    };

    loadPets();
  }, [token, isLoading, user, router]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      if (activeFilter === "disponiveis" && pet.isAdopted) return false;
      if (activeFilter === "adotados" && !pet.isAdopted) return false;
      if (
        searchTerm &&
        !pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [pets, activeFilter, searchTerm]);

  const counts = {
    todos: pets.length,
    disponiveis: pets.filter((pet) => !pet.isAdopted).length,
    adotados: pets.filter((pet) => pet.isAdopted).length,
  };

  const handleDelete = async (petId: string) => {
    if (!token) return;

    try {
      await apiFetch(`/pets/${petId}`, { method: "DELETE" }, token);
      setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId));
    } catch {
      setError(
        "Não foi possível excluir o pet. Verifique se há solicitações vinculadas.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-0">
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Meus pets cadastrados
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Veja, edite ou remova os animais cadastrados por você. A mesma
              identidade visual do projeto foi mantida para que a navegação
              fique consistente com o restante da aplicação.
            </p>
          </div>

          <Link
            href="/pessoa-fisica/cadastrar-pet"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Cadastrar novo pet <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Pets cadastrados" value={counts.todos} />
          <StatCard label="Disponíveis" value={counts.disponiveis} />
          <StatCard label="Adotados" value={counts.adotados} />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar pet pelo nome..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10"
          />
        </div>

        <div className="inline-flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
          {[
            { id: "todos", label: "Todos", count: counts.todos },
            {
              id: "disponiveis",
              label: "Disponíveis",
              count: counts.disponiveis,
            },
            { id: "adotados", label: "Adotados", count: counts.adotados },
          ].map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as FilterStatus)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-brand-700 shadow"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                {isActive && <Filter size={15} className="text-brand-500" />}
                {filter.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-brand-50 text-brand-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p
          className="mb-6 rounded-2xl border px-4 py-3 text-sm shadow-sm"
          style={{
            backgroundColor: STATUS_COLORS.danger[100],
            borderColor: STATUS_COLORS.danger[200],
            color: STATUS_COLORS.danger[700],
          }}
        >
          {error}
        </p>
      )}

      {filteredPets.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <PawPrint size={44} className="mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-900">
            Nenhum pet encontrado
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            {activeFilter === "todos" && !searchTerm
              ? "Você ainda não cadastrou nenhum pet. Use o botão acima para iniciar um novo cadastro."
              : "Nenhum pet corresponde ao filtro ou à busca atual."}
          </p>
          {activeFilter === "todos" && !searchTerm && (
            <Link
              href="/pessoa-fisica/cadastrar-pet"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Cadastrar pet <ArrowRight size={16} />
            </Link>
          )}
        </section>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPets.map((pet) => (
            <article
              key={pet.id}
              className="group isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 will-change-transform transform-gpu hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/pet/${pet.id}`} className="block outline-none">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 [transform:translateZ(0)]">
                  {pet.photoUrl ? (
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="h-full w-full object-cover transition duration-500 will-change-transform transform-gpu group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
                      <PawPrint size={54} />
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                    {pet.isAdopted ? "Adotado" : "Disponível"}
                  </div>
                </div>
              </Link>

              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-slate-500">{pet.species}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {pet.age} {pet.age === 1 ? "ano" : "anos"}
                  </span>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                  {pet.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays size={16} className="text-brand-500" />
                  Cadastrado no seu perfil
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    href={`/pet/${pet.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <ExternalLink size={16} /> Ver
                  </Link>
                  <Link
                    href={`/pessoa-fisica/meus-pets/${pet.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    <Pencil size={16} /> Editar
                  </Link>
                </div>

                <div className="mt-3">
                  <DeletePetButton pet={pet} onDelete={handleDelete} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-4 shadow-sm ring-1 ring-brand-100/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function DeletePetButton({
  pet,
  onDelete,
}: {
  pet: Pet;
  onDelete: (id: string) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100">
          <Trash2 size={16} /> Excluir pet
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="mx-auto w-[calc(100%-32px)] rounded-2xl bg-white sm:w-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-900">
            Excluir {pet.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Esta ação remove o pet da sua lista e não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel className="mt-0 rounded-lg border-none bg-slate-100 text-slate-700 hover:bg-slate-200">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(pet.id)}
            className="rounded-lg bg-red-600 font-semibold text-white transition-colors hover:bg-red-700 focus:ring-red-500"
          >
            Sim, excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
