import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  cep?: string;
}
