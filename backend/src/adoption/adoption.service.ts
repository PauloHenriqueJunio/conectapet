import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AdoptionStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAdoptionRequestDto } from "./dto/create-adoption-request.dto";
import { UpdateAdoptionStatusDto } from "./dto/update-adoption-status.dto";

@Injectable()
export class AdoptionService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(dto: CreateAdoptionRequestDto, adopterId: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id: dto.petId } });

    if (!pet) {
      throw new NotFoundException("Pet não encontrado.");
    }

    if (pet.isAdopted) {
      throw new BadRequestException("Este pet já foi adotado.");
    }

    if (pet.ongId === adopterId) {
      throw new BadRequestException(
        "ONG não pode solicitar adoção do próprio pet.",
      );
    }

    try {
      return await this.prisma.adoptionRequest.create({
        data: {
          petId: dto.petId,
          adopterId,
          message: dto.message,
          status: AdoptionStatus.PENDING,
        },
        include: {
          pet: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(
          "Você já enviou uma solicitação para este pet.",
        );
      }

      throw error;
    }
  }

  myRequests(adopterId: string) {
    return this.prisma.adoptionRequest.findMany({
      where: { adopterId },
      include: {
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
            ong: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  ongRequests(ongId: string) {
    return this.prisma.adoptionRequest.findMany({
      where: { pet: { ongId } },
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
  }

  async updateStatus(
    requestId: string,
    dto: UpdateAdoptionStatusDto,
    ongId: string,
  ) {
    const adoptionRequest = await this.prisma.adoptionRequest.findUnique({
      where: { id: requestId },
      include: { pet: true },
    });

    if (!adoptionRequest) {
      throw new NotFoundException("Solicitação não encontrada.");
    }

    if (adoptionRequest.pet.ongId !== ongId) {
      throw new ForbiddenException("Você não pode alterar esta solicitação.");
    }

    if (adoptionRequest.status !== AdoptionStatus.PENDING) {
      throw new BadRequestException("Solicitação já foi processada.");
    }

    const result = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const updatedRequest = await tx.adoptionRequest.update({
          where: { id: requestId },
          data: { status: dto.status },
        });

        if (dto.status === AdoptionStatus.APPROVED) {
          await tx.pet.update({
            where: { id: adoptionRequest.petId },
            data: { isAdopted: true },
          });

          await tx.adoptionRequest.updateMany({
            where: {
              petId: adoptionRequest.petId,
              id: { not: adoptionRequest.id },
              status: AdoptionStatus.PENDING,
            },
            data: { status: AdoptionStatus.REJECTED },
          });
        }

        return updatedRequest;
      },
    );

    return result;
  }

  async cancelRequest(requestId: string, adopterId: string) {
    const adoptionRequest = await this.prisma.adoptionRequest.findUnique({
      where: { id: requestId },
    });

    if (!adoptionRequest) {
      throw new NotFoundException("Solicitação não encontrada.");
    }

    if (adoptionRequest.adopterId !== adopterId) {
      throw new ForbiddenException("Você não pode cancelar esta solicitação.");
    }

    if (adoptionRequest.status !== AdoptionStatus.PENDING) {
      throw new BadRequestException(
        "Só é possível cancelar solicitações pendentes.",
      );
    }

    await this.prisma.adoptionRequest.delete({ where: { id: requestId } });

    return { success: true };
  }
}
