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

