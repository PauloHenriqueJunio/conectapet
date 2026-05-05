import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RequestUser } from "../auth/types/request-user.type";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { PetsService } from "./pets.service";

type UploadedImageFile = {
  mimetype: string;
  size: number;
  buffer: Buffer;
};

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PET_UPLOAD_OPTIONS = {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (
    _req: unknown,
    file: { mimetype: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException("Apenas imagens JPG, PNG ou WEBP."),
        false,
      );
      return;
    }

    callback(null, true);
  },
};

@Controller("pets")
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG, Role.PESSOA_FISICA)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "photo", maxCount: 1 },
        { name: "photos", maxCount: 5 },
      ],
      PET_UPLOAD_OPTIONS,
    ),
  )
  create(
    @Body() dto: CreatePetDto,
    @Req() req: any,
    @UploadedFiles()
    files?: { photo?: UploadedImageFile[]; photos?: UploadedImageFile[] },
  ) {
    return this.petsService.create(dto, req.user.userId, files);
  }

  @Get()
  findAllAvailable(@Query("species") species?: string) {
    return this.petsService.findAvailable(species);
  }

  @Get("ong/:ongId/available-count")
  countAvailableByOng(@Param("ongId") ongId: string) {
    return this.petsService.countAvailableByOng(ongId);
  }

  @Get("ong/:ongId/available")
  findAvailableByOng(@Param("ongId") ongId: string) {
    return this.petsService.findAvailableByOng(ongId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG, Role.PESSOA_FISICA)
  @Patch(":id")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "photo", maxCount: 1 },
        { name: "photos", maxCount: 5 },
      ],
      PET_UPLOAD_OPTIONS,
    ),
  )
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePetDto,
    @Req() req: { user: RequestUser },
    @UploadedFiles()
    files?: { photo?: UploadedImageFile[]; photos?: UploadedImageFile[] },
  ) {
    return this.petsService.update(id, dto, req.user.userId, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG, Role.PESSOA_FISICA)
  @Get("my-pets")
  findMyPets(@Req() req: { user: RequestUser }) {
    return this.petsService.findByOng(req.user.userId);
  }

  @Roles(Role.ONG, Role.PESSOA_FISICA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: { user: RequestUser }) {
    return this.petsService.remove(id, req.user.userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.petsService.findOne(id);
  }
}
