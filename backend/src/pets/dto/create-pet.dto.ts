import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Type, Transform } from "class-transformer";

function parseStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === "string",
        );
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}

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

  @Transform(({ value }) => parseStringArray(value))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  featuredPhotoIndex?: number;
}
