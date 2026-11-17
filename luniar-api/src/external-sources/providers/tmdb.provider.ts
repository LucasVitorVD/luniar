import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BaseProvider } from "./base.provider.js";
import { MediaType, WorkCandidateDTO } from "../dto/work-candidate.dto.js";
import { WorkDetailsDTO } from "../dto/work-details.dto.js";
import { TmdbResponse } from "../interfaces/tmdb.js";
import { TmdbWorkDetails } from "../interfaces/tmdb-work-details.js";
import { HttpClient, InjectHttpClient } from "@nestjs/http-client";

@Injectable()
export class TmdbProvider implements BaseProvider {
  constructor(@InjectHttpClient('tmdb') private readonly tmdbClient: HttpClient) { }

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
      .filter((r) => r.media_type === "movie" || r.media_type === 'tv')
      .map((r) => {
        const title = r.title ?? r.name ?? "Título não disponível";
        const year = r.release_date ?? r.first_air_date ?? undefined;
        const coverPath = r.poster_path ?? r.backdrop_path ?? undefined;
        const coverUrl = coverPath ? `${process.env.TMDB_IMAGE_BASE_URL}${coverPath}` : undefined;
        const externalId = `${r.media_type}:${r.id}`
        const mediaType = r.media_type as MediaType

        return new WorkCandidateDTO(
          externalId,
          title,
          mediaType,
          year,
          coverUrl,
          "TMDB"
        );
      });
  }

  async getDetails(externalId: string): Promise<WorkDetailsDTO> {
    const { mediaType, id } = this.parseExternalId(externalId);

    const { data: result, ok, status } = await this.tmdbClient.get<TmdbWorkDetails>(
      `${process.env.TMDB_API_URL}/${mediaType}/${id}`,
      { query: { language: 'pt-BR' } },
    );

    if (status === 404) {
      throw new NotFoundException(`Work ${externalId} not found in TMDB`);
    }

    if (!ok || !result) {
      throw new Error(`TMDB details failed with status: ${status}`);
    }

    const title = result.title ?? result.name ?? 'Título não disponível';
    const overview = result.overview ?? undefined;
    const year = result.release_date ?? result.first_air_date ?? undefined;
    const coverPath = result.poster_path ?? result.backdrop_path ?? undefined;
    const backdropPath = result.backdrop_path ?? undefined;
    const coverUrl = coverPath ? `${process.env.TMDB_IMAGE_BASE_URL}${coverPath}` : undefined;
    const backdropUrl = backdropPath ? `${process.env.TMDB_IMAGE_BASE_URL}${backdropPath}` : undefined;

    return new WorkDetailsDTO(
      externalId,
      'TMDB',
      title,
      overview,
      coverUrl,
      backdropUrl,
      year,
    );
  }

  private parseExternalId(externalId: string) {
    const [mediaType, id] = externalId.split(':');

    if ((mediaType !== 'movie' && mediaType !== 'tv') || !id) {
      throw new BadRequestException(
        `Invalid externalId "${externalId}". Expected "movie:<id>" or "tv:<id>"`,
      );
    }

    return { mediaType, id };
  }
}
