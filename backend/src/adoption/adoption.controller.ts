import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  Param,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RequestUser } from "../auth/types/request-user.type";
import { AdoptionService } from "./adoption.service";
import { CreateAdoptionRequestDto } from "./dto/create-adoption-request.dto";
import { UpdateAdoptionStatusDto } from "./dto/update-adoption-status.dto";

@Controller("adoptions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @Roles(Role.ADOTANTE)
  @Post()
  create(
    @Body() dto: CreateAdoptionRequestDto,
    @Req() req: { user: RequestUser },
  ) {
    return this.adoptionService.createRequest(dto, req.user.userId);
  }

  @Roles(Role.ADOTANTE)
  @Get("my-requests")
  myRequests(@Req() req: { user: RequestUser }) {
    return this.adoptionService.myRequests(req.user.userId);
  }

  @Roles(Role.ONG)
  @Get("ong-requests")
  ongRequests(@Req() req: { user: RequestUser }) {
    return this.adoptionService.ongRequests(req.user.userId);
  }

  @Roles(Role.ONG)
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateAdoptionStatusDto,
    @Req() req: { user: RequestUser },
  ) {
    return this.adoptionService.updateStatus(id, dto, req.user.userId);
  }
}
