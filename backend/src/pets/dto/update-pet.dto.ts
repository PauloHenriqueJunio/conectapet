import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { CreatePetDto } from "./create-pet.dto";

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

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @Transform(({ value }) => parseStringArray(value))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  retainedPhotoUrls?: string[];
}
