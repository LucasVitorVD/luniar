import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchWorkDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  readonly query: string
}