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

/** Nome unico usado no `layoutId` do Framer Motion para fazer a foto do
 *  card "morphar" ate a foto da pagina do pet. */
export function petPhotoLayoutId(petId: string): string {
  return `pet-photo-${petId}`;
}
