import { Injectable } from "@nestjs/common";
import { BaseProvider } from "./base.provider.js";
import { WorkCandidateDTO } from "../dto/work-candidate.dto.js";
import { TmdbResponse } from "../interfaces/tmdb.js";
import { HttpClient, InjectHttpClient } from "@nestjs/http-client";

@Injectable()
export class TmdbProvider implements BaseProvider {
  constructor(@InjectHttpClient('tmdb') private readonly tmdbClient: HttpClient) {}

  async search(query: string): Promise<WorkCandidateDTO[]> {
    const { data, status, ok } = await this.tmdbClient.get<TmdbResponse>(
      `${process.env.TMDB_API_URL}/search/multi`,
      {
        query: {
          query,
          include_adult: false,
          language: 'pt-BR',
          page: 1,
        },
      },
    );

    if (!ok) {
      throw new Error(`Response status: ${status}`);
    }

    if (data.total_results === 0) {
      throw new Error("Work not found in TMDB!");
    }

    return data.results.map((result) => {
      return new WorkCandidateDTO(
        result.id,
        result.title!,
        result.media_type,
        result.release_date!,
        result.poster_path ?? result.backdrop_path!,
        "TMDB"
      )
    })
  }
}