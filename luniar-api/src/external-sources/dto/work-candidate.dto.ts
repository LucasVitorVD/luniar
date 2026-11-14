import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class WorkCandidateDTO {
  @IsNotEmpty()
  private id: unknown

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  private title: string

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  private mediaType: string

  @IsString()
  @Transform(({ value }) => typeof value != "string" ? String(value).trim() : value.trim())
  private year: string

  @IsString()
  @Transform(({ value }) => value.trim())
  private coverUrl: string

  @IsString()
  @Transform(({ value }) => value.trim())
  private source: string

  constructor(
    id: unknown,
    title: string,
    mediaType: string, 
    year: string, 
    coverUrl: string,
    source: string
  ) {
    this.id = id,
    this.title = title,
    this.mediaType = mediaType,
    this.year = year,
    this.coverUrl = coverUrl,
    this.source = source
  }
}