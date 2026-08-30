import { describe, expect, it } from "vitest";
import { isPetVaccinated } from "./pet";
import { Pet } from "@/types/api";

function makePet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: "1",
    name: "Rex",
    species: "Cão",
    age: 3,
    description: "",
    photoUrl: "",
    photoUrls: [],
    featuredPhotoIndex: 0,
    isAdopted: false,
    ongId: "ong-1",
    size: "Médio",
    sex: "Macho",
    isCastrated: false,
    isDewormed: false,
    hasVaccineV8: false,
    hasVaccineGiardia: false,
    hasVaccineFlu: false,
    hasVaccineRabies: false,
    hasVaccineFeline: false,
    hasVaccineFelv: false,
    hasHistoryOfIllness: false,
    hasOtherHealthInfo: false,
    ...overrides,
  };
}

describe("isPetVaccinated", () => {
  it("returns false when no vaccine flag is set", () => {
    expect(isPetVaccinated(makePet())).toBe(false);
  });

  it("returns true when at least one vaccine flag is set", () => {
    expect(isPetVaccinated(makePet({ hasVaccineRabies: true }))).toBe(true);
  });

  it("returns true when a cat-specific vaccine flag is set", () => {
    expect(isPetVaccinated(makePet({ hasVaccineFelv: true }))).toBe(true);
  });
});
