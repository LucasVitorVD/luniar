import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export type MediaType = 'movie' | 'tv' | 'game';

export class WorkCandidateDTO {
  @IsNotEmpty()
  readonly id: string

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : String(value).trim()))
  readonly title: string

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : String(value).trim()))
  readonly mediaType: MediaType

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : String(value).trim()))
  readonly year?: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : String(value).trim()))
  readonly coverUrl?: string

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : String(value).trim()))
  readonly source: string

  constructor(
    id: string,
    title: string,
    mediaType: MediaType,
    year?: string,
    coverUrl?: string,
    source: string = "TMDB"
  ) {
    this.id = id
    this.title = title
    this.mediaType = mediaType
    this.year = year
    this.coverUrl = coverUrl
    this.source = source
  }
}
