import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  species!: string;

  @IsNotEmpty()
  @IsString()
  sex!: string;

  @IsNotEmpty()
  @IsString()
  size!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  age!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  donationReason?: string;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isCastrated!: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isDewormed!: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  hasVaccineV8!: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  hasVaccineRabies!: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  @IsBoolean()
  hasVaccineGiardia?: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  @IsBoolean()
  hasVaccineFlu?: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  @IsBoolean()
  hasVaccineFeline?: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsOptional()
  @IsBoolean()
  hasVaccineFelv?: boolean;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  hasHistoryOfIllness!: boolean;

  @IsOptional()
  @IsString()
  illnessDescription?: string;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  hasOtherHealthInfo!: boolean;

  @IsOptional()
  @IsString()
  otherHealthInfoDescription?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
