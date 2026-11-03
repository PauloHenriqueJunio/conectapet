import { Pet } from "@/types/api";

export function isPetVaccinated(pet: Pet): boolean {
  return (
    pet.hasVaccineV8 ||
    pet.hasVaccineGiardia ||
    pet.hasVaccineFlu ||
    pet.hasVaccineRabies ||
    pet.hasVaccineFeline ||
    pet.hasVaccineFelv
  );
}

/** Texto curto de "há quanto tempo" o pet está esperando adoção, usado no
 *  destaque de prioridade da home (pets cadastrados há mais tempo). */
export function formatWaitLabel(createdAt: string): string {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return "Esperando um lar";

  const days = Math.max(
    0,
    Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24)),
  );

  if (days < 30) return "Chegou recentemente";

  const months = Math.floor(days / 30);
  return `Espera há ${months} ${months === 1 ? "mês" : "meses"}`;
}

