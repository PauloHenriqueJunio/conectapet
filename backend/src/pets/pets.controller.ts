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
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RequestUser } from "../auth/types/request-user.type";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { PetsService } from "./pets.service";

@Controller("pets")
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG)
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() dto: CreatePetDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.petsService.create(dto, req.user.userId, file);
  }


  @Get()
  findAllAvailable(@Query("species") species?: string) {
    return this.petsService.findAvailable(species);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePetDto,
    @Req() req: { user: RequestUser },
  ) {
    return this.petsService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ONG)
  @Get("my-pets")
  findMyPets(@Req() req: { user: RequestUser }) {
    return this.petsService.findByOng(req.user.userId);
  }
}
