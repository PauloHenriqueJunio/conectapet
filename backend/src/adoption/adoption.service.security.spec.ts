import { AdoptionService } from "./adoption.service";

describe("AdoptionService - security", () => {
  it("sanitizes ONG request queries to avoid returning full adopter records", async () => {
    const prisma = {
      adoptionRequest: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const service = new AdoptionService(prisma as never);

    await service.ongRequests("ong-1");

    expect(prisma.adoptionRequest.findMany).toHaveBeenCalledWith({
      where: { pet: { ongId: "ong-1" } },
      select: {
        id: true,
        petId: true,
        adopterId: true,
        status: true,
        message: true,
        createdAt: true,
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            photoUrl: true,
            isCastrated: true,
            isDewormed: true,
            hasVaccineV8: true,
            hasVaccineGiardia: true,
            hasVaccineFlu: true,
            hasVaccineRabies: true,
            hasVaccineFeline: true,
            hasVaccineFelv: true,
            hasHistoryOfIllness: true,
            illnessDescription: true,
            hasOtherHealthInfo: true,
            otherHealthInfoDescription: true,
          },
        },
        adopter: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  });
});
