import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAdoptionRequestDto {
  @IsUUID()
  petId!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;
}
