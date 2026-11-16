import { Injectable } from "@nestjs/common";
import { BaseProvider } from "./base.provider.js";
import { WorkCandidateDTO } from "../dto/work-candidate.dto.js";
import { WorkDetailsDTO } from "../dto/work-details.dto.js";
import { TmdbResponse } from "../interfaces/tmdb.js";
import { TmdbWorkDetails } from "../interfaces/tmdb-work-details.js";
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
      throw new Error(`TMDB search failed with status: ${status}`);
    }

    if (!data || data.total_results === 0) {
      return [];
    }

    return data.results
      .filter((result) => result.media_type !== "person")
      .map((result) => {
        const title = result.title ?? result.name ?? "Título não disponível";
        const year = result.release_date ?? result.first_air_date ?? undefined;
        const coverPath = result.poster_path ?? result.backdrop_path ?? undefined;
        const coverUrl = coverPath ? `${process.env.TMDB_IMAGE_BASE_URL}${coverPath}` : undefined;

        return new WorkCandidateDTO(
          result.id,
          title,
          result.media_type,
          year,
          coverUrl,
          "TMDB"
        );
      });
  }

  async getDetails(externalId: string): Promise<WorkDetailsDTO> {
    let result: any = null;
    let mediaType: string | undefined;

    try {
      const { data, ok } = await this.tmdbClient.get<TmdbWorkDetails>(
        `${process.env.TMDB_API_URL}/multi/${externalId}`,
        {
          query: { language: 'pt-BR' },
        },
      );
      if (ok && data) {
        result = data;
        mediaType = data.media_type;
      }
    } catch {
      // Ignora erro do /multi e tenta endpoints específicos abaixo
    }

    if (!result) {
      for (const endpoint of ['movie', 'tv']) {
        try {
          const { data, ok } = await this.tmdbClient.get<TmdbWorkDetails>(
            `${process.env.TMDB_API_URL}/${endpoint}/${externalId}`,
            {
              query: { language: 'pt-BR' },
            },
          );
          if (ok && data) {
            result = data;
            mediaType = endpoint;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    if (!result) {
      throw new NotFoundException(`Work with ID ${externalId} not found in TMDB`);
    }

    const title = result.title ?? result.name ?? "Título não disponível";
    const overview = result.overview ?? undefined;
    const year = result.release_date ?? result.first_air_date ?? undefined;
    const coverPath = result.poster_path ?? result.backdrop_path ?? undefined;
    const backdropPath = result.backdrop_path ?? undefined;
    const coverUrl = coverPath ? `${process.env.TMDB_IMAGE_BASE_URL}${coverPath}` : undefined;
    const backdropUrl = backdropPath ? `${process.env.TMDB_IMAGE_BASE_URL}${backdropPath}` : undefined;

    return new WorkDetailsDTO(
      result.id.toString(),
      "TMDB",
      title,
      overview,
      coverUrl,
      backdropUrl,
      year,
      undefined
    );
  }
}
