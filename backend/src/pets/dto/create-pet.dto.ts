import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  species!: string;

  @IsInt()
  @Min(0)
  age!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
