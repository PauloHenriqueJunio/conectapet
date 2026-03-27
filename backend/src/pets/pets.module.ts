import { Module } from "@nestjs/common";
import { PetsController } from "./pets.controller";
import { PetsService } from "./pets.service";
import { PrismaModule } from "../prisma/prisma.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
