import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  findAvailable(species?: string) {
    return this.prisma.pet.findMany({
      where: {
        isAdopted: false,
        ...(species
          ? { species: { equals: species, mode: "insensitive" } }
          : {}),
      },
      include: {
        ong: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  create(dto: CreatePetDto, ongId: string) {
    return this.prisma.pet.create({
      data: {
        ...dto,
        photoUrl: dto.photoUrl ?? "",
        ongId,
      },
    });
  }

  async update(id: string, dto: UpdatePetDto, ongId: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });

    if (!pet) {
      throw new NotFoundException("Pet não encontrado.");
    }

    if (pet.ongId !== ongId) {
      throw new ForbiddenException("Você não pode editar este pet.");
    }

    return this.prisma.pet.update({
      where: { id },
      data: dto,
    });
  }

  findByOng(ongId: string) {
    return this.prisma.pet.findMany({
      where: { ongId },
      orderBy: { createdAt: "desc" },
    });
  }
}
