import { AdoptionStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateAdoptionStatusDto {
  @IsEnum(AdoptionStatus)
  status!: AdoptionStatus;
}
