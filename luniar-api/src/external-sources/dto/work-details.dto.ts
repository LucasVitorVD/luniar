import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class WorkDetailsDTO {
  @IsString()
  @IsNotEmpty()
  readonly externalSourceId: string

  @IsString()
  @IsNotEmpty()
  readonly externalSourceType: string

  @IsString()
  @IsNotEmpty()
  readonly title: string

  @IsString()
  @IsOptional()
  readonly overview?: string

  @IsString()
  @IsOptional()
  readonly coverUrl?: string

  @IsString()
  @IsOptional()
  readonly backdropUrl?: string

  @IsString()
  @IsOptional()
  readonly year?: string

  @IsString()
  @IsOptional()
  readonly director?: string

  constructor(
    externalSourceId: string,
    externalSourceType: string,
    title: string,
    overview?: string,
    coverUrl?: string,
    backdropUrl?: string,
    year?: string,
    director?: string
  ) {
    this.externalSourceId = externalSourceId
    this.externalSourceType = externalSourceType
    this.title = title
    this.overview = overview
    this.coverUrl = coverUrl
    this.backdropUrl = backdropUrl
    this.year = year
    this.director = director
  }
}
