import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BaseProvider } from "./base.provider.js";
import { WorkCandidateDTO, MediaType } from "../dto/work-candidate.dto.js";
import { WorkDetailsDTO } from "../dto/work-details.dto.js";
import { IgdbAuthService } from "../services/igdb-auth.service.js";
import { IgdbGame } from "../interfaces/igdb.js";

@Injectable()
export class IgdbProvider implements BaseProvider {
  private readonly logger = new Logger(IgdbProvider.name);

  constructor(private readonly authService: IgdbAuthService) {}

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await this.authService.getValidToken();
    const clientId = process.env.IGDB_CLIENT_ID;

    if (!clientId) {
      throw new Error('IGDB_CLIENT_ID is not configured');
    }

    return {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
  }

  private formatReleaseDate(unixTimestamp?: number): string | undefined {
    if (!unixTimestamp) return undefined;
    return new Date(unixTimestamp * 1000).toISOString().split('T')[0];
  }

  private getCoverUrl(coverUrl?: string): string | undefined {
    if (!coverUrl) return undefined;
    const formattedUrl = coverUrl.startsWith('//') ? `https:${coverUrl}` : coverUrl;
    return formattedUrl.replace('t_thumb', 't_cover_big');
  }

  async search(query: string): Promise<WorkCandidateDTO[]> {
    const headers = await this.getHeaders();

    const body = `
      fields name, first_release_date, cover.url;
      search "${query}";
      where version_parent = null;
      limit 10;
    `;

    try {
      const response = await fetch(`${process.env.IGDB_API_URL}/games`, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        this.logger.error(`IGDB search failed with status ${response.status}`);
        if (response.status === 401) {
          this.authService.clearToken();
        }
        return [];
      }

      const data: IgdbGame[] = await response.json();

      return data.map((game) => {
        const coverPath = game.cover?.url;
        const coverUrl = coverPath ? this.getCoverUrl(coverPath) : undefined;
        const year = this.formatReleaseDate(game.first_release_date);

        return new WorkCandidateDTO(
          String(game.id),
          game.name,
          'game' as MediaType,
          year,
          coverUrl,
          'IGDB'
        );
      });
    } catch (error: any) {
      this.logger.error('IGDB search error', error.stack);
      if (error.status === 401) {
        this.authService.clearToken();
      }
      return [];
    }
  }

  async getDetails(externalId: string): Promise<WorkDetailsDTO> {
    const headers = await this.getHeaders();
    const id = parseInt(externalId, 10);

    if (isNaN(id)) {
      throw new NotFoundException(`Invalid IGDB ID: ${externalId}`);
    }

    const body = `
      fields name, summary, first_release_date, cover.url;
      where id = ${id};
      limit 1;
    `;

    try {
      const response = await fetch(`${process.env.IGDB_API_URL}/games`, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.authService.clearToken();
        }
        throw new NotFoundException(`Game with ID ${externalId} not found in IGDB`);
      }

      const data: IgdbGame[] = await response.json();

      if (!data || data.length === 0) {
        throw new NotFoundException(`Game with ID ${externalId} not found in IGDB`);
      }

      const game = data[0];
      const coverPath = game.cover?.url;
      const coverUrl = coverPath ? this.getCoverUrl(coverPath) : undefined;
      const backdropUrl = coverUrl;
      const year = this.formatReleaseDate(game.first_release_date);

      return new WorkDetailsDTO(
        game.id.toString(),
        'IGDB',
        game.name,
        game.summary,
        coverUrl,
        backdropUrl,
        year,
        undefined
      );
    } catch (error: any) {
      if (error.status === 401) {
        this.authService.clearToken();
      }
      throw error;
    }
  }
}
