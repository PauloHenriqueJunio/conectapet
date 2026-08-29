import { MinLength } from "class-validator";

export class DeleteAccountDto {
  @MinLength(6)
  password!: string;
}
