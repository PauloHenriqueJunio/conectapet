import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

type UploadedImageFile = {
  mimetype: string;
  size: number;
  buffer: Buffer;
};

type UploadedPhotoFields = {
  photo?: UploadedImageFile[];
  photos?: UploadedImageFile[];
};

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        ong: {
          select: {
            name: true,
            contact: true,
          },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException("Pet não encontrado.");
    }

    return pet;
  }

  private collectUploadedFiles(
    files?: UploadedPhotoFields,
  ): UploadedImageFile[] {
    if (!files) return [];
    return [...(files.photos ?? []), ...(files.photo ?? [])];
  }

  private validateUploadedFiles(files: UploadedImageFile[]) {
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException("Apenas imagens JPG, PNG ou WEBP.");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException("Tamanho máximo permitido é de 5MB.");
      }
    }
  }

  private sanitizePhotoUrls(urls?: string[]): string[] {
    if (!urls) return [];
    return urls.filter((url) => typeof url === "string" && url.trim() !== "");
  }

  private normalizeFeaturedIndex(
    photoUrls: string[],
    requestedIndex?: number,
  ): number {
    if (photoUrls.length === 0) return 0;

    const fallbackIndex = requestedIndex ?? 0;
    if (fallbackIndex < 0) return 0;
    if (fallbackIndex > photoUrls.length - 1) return photoUrls.length - 1;
    return fallbackIndex;
  }

  private async uploadPhotos(files: UploadedImageFile[]): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      uploadedUrls.push(uploadResult.secure_url);
    }
    return uploadedUrls;
  }

  async create(dto: CreatePetDto, ongId: string, files?: UploadedPhotoFields) {
    const {
      photoUrl: legacyPhotoUrl,
      photoUrls: dtoPhotoUrls,
      featuredPhotoIndex,
      ...petData
    } = dto;

    const uploadedFiles = this.collectUploadedFiles(files);
    this.validateUploadedFiles(uploadedFiles);

    const existingUrls = this.sanitizePhotoUrls(dtoPhotoUrls);
    if (legacyPhotoUrl && !existingUrls.includes(legacyPhotoUrl)) {
      existingUrls.unshift(legacyPhotoUrl);
    }

    const uploadedUrls = await this.uploadPhotos(uploadedFiles);
    const mergedPhotoUrls = [...existingUrls, ...uploadedUrls];

    if (mergedPhotoUrls.length > MAX_PHOTOS) {
      throw new BadRequestException(
        "Você pode enviar no máximo 5 fotos por pet.",
      );
    }

    const normalizedFeaturedIndex = this.normalizeFeaturedIndex(
      mergedPhotoUrls,
      featuredPhotoIndex,
    );
    const featuredPhotoUrl = mergedPhotoUrls[normalizedFeaturedIndex] ?? "";

    return this.prisma.pet.create({
      data: {
        ...petData,
        photoUrl: featuredPhotoUrl,
        photoUrls: mergedPhotoUrls,
        featuredPhotoIndex: normalizedFeaturedIndex,
        ongId,
      },
    });
  }

  async update(
    id: string,
    dto: UpdatePetDto,
    ongId: string,
    files?: UploadedPhotoFields,
  ) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });

    if (!pet) {
      throw new NotFoundException("Pet não encontrado.");
    }

    if (pet.ongId !== ongId) {
      throw new ForbiddenException("Você não pode editar este pet.");
    }

    const {
      photoUrl: legacyPhotoUrl,
      photoUrls: dtoPhotoUrls,
      retainedPhotoUrls,
      featuredPhotoIndex,
      ...petData
    } = dto;

    const uploadedFiles = this.collectUploadedFiles(files);
    this.validateUploadedFiles(uploadedFiles);

    const petWithGallery = pet as unknown as {
      photoUrls?: string[];
      featuredPhotoIndex?: number;
    };

    const currentPhotoUrls =
      Array.isArray(petWithGallery.photoUrls) &&
      petWithGallery.photoUrls.length > 0
        ? petWithGallery.photoUrls
        : pet.photoUrl
          ? [pet.photoUrl]
          : [];

    const currentFeaturedPhotoIndex =
      typeof petWithGallery.featuredPhotoIndex === "number"
        ? petWithGallery.featuredPhotoIndex
        : 0;

    let baseUrls = this.sanitizePhotoUrls(retainedPhotoUrls);
    if (!retainedPhotoUrls) {
      baseUrls = this.sanitizePhotoUrls(dtoPhotoUrls);
    }
    if (!retainedPhotoUrls && !dtoPhotoUrls) {
      baseUrls = currentPhotoUrls;
    }
    if (legacyPhotoUrl && !baseUrls.includes(legacyPhotoUrl)) {
      baseUrls.unshift(legacyPhotoUrl);
    }

    const uploadedUrls = await this.uploadPhotos(uploadedFiles);
    const mergedPhotoUrls = [...baseUrls, ...uploadedUrls];

    if (mergedPhotoUrls.length > MAX_PHOTOS) {
      throw new BadRequestException(
        "Você pode enviar no máximo 5 fotos por pet.",
      );
    }

    const normalizedFeaturedIndex = this.normalizeFeaturedIndex(
      mergedPhotoUrls,
      featuredPhotoIndex ?? currentFeaturedPhotoIndex,
    );
    const featuredPhotoUrl = mergedPhotoUrls[normalizedFeaturedIndex] ?? "";

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...petData,
        photoUrl: featuredPhotoUrl,
        photoUrls: mergedPhotoUrls,
        featuredPhotoIndex: normalizedFeaturedIndex,
      },
    });
  }

  async remove(id: string, ongId: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });

    if (!pet) {
      throw new NotFoundException("Pet não encontrado.");
    }

    if (pet.ongId !== ongId) {
      throw new ForbiddenException("Você não pode remover este pet.");
    }

    return this.prisma.pet.delete({
      where: { id },
    });
  }

  findByOng(ongId: string) {
    return this.prisma.pet.findMany({
      where: { ongId },
      orderBy: { createdAt: "desc" },
    });
  }
}
