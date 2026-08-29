import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";

const cache = new Map<string, Pet>();

/** Busca o pet em segundo plano (chamado no hover do card) para a pagina
 *  do pet ja nascer com os dados prontos, sem esperar a API responder. */
export function prefetchPet(id: string) {
  if (!id || cache.has(id)) return;
  apiFetch<Pet>(`/pets/${id}`)
    .then((pet) => {
      cache.set(id, pet);
    })
    .catch(() => {
      // Sem problema: a pagina do pet busca de novo normalmente se o
      // prefetch falhar.
    });
}

export function getCachedPet(id: string): Pet | null {
  return cache.get(id) ?? null;
}
