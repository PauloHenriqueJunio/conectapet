import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

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

  @IsInt()
  @Min(0)
  age!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  donationReason?: string;

  @IsBoolean()
  isCastrated!: boolean;

  @IsBoolean()
  isDewormed!: boolean;

  @IsBoolean()
  hasVaccineV8!: boolean;

  @IsBoolean()
  hasVaccineRabies!: boolean;

  @IsBoolean()
  hasHistoryOfIllness!: boolean;

  @IsOptional()
  @IsString()
  illnessDescription?: string;

  @IsBoolean()
  hasOtherHealthInfo!: boolean;

  @IsOptional()
  @IsString()
  otherHealthInfoDescription?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
