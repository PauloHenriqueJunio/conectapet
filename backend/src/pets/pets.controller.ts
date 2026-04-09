import {
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

@Controller("pets")
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG, Role.PESSOA_FISICA)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "photo", maxCount: 1 },
      { name: "photos", maxCount: 5 },
    ]),
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG, Role.PESSOA_FISICA)
  @Patch(":id")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "photo", maxCount: 1 },
      { name: "photos", maxCount: 5 },
    ]),
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
