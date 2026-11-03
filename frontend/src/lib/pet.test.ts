import { describe, expect, it } from "vitest";
import { formatWaitLabel, isPetVaccinated } from "./pet";
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
    createdAt: "2026-01-01T00:00:00.000Z",
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

describe("formatWaitLabel", () => {
  it("returns a recent-arrival label for pets created less than 30 days ago", () => {
    const createdAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatWaitLabel(createdAt)).toBe("Chegou recentemente");
  });

  it("returns the number of months waiting for older pets", () => {
    const createdAt = new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatWaitLabel(createdAt)).toBe("Espera há 3 meses");
  });

  it("uses singular 'mês' for exactly one month", () => {
    const createdAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatWaitLabel(createdAt)).toBe("Espera há 1 mês");
  });

  it("falls back to a generic label for an invalid date", () => {
    expect(formatWaitLabel("not-a-date")).toBe("Esperando um lar");
  });
});
