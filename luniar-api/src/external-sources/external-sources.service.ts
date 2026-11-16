import { Injectable } from '@nestjs/common';
import { WorkCandidateDTO } from './dto/work-candidate.dto.js';
import { WorkDetailsDTO } from './dto/work-details.dto.js';
import { TmdbProvider } from './providers/tmdb.provider.js';
import { IgdbProvider } from './providers/igdb.provider.js';

@Injectable()
export class ExternalSourcesService {
  constructor(
    private readonly tmdbProvider: TmdbProvider,
    private readonly igdbProvider: IgdbProvider,
  ) {}

  async searchWorks(query: string): Promise<WorkCandidateDTO[]> {
    const [tmdbResults, igdbResults] = await Promise.all([
      this.tmdbProvider.search(query).catch(() => []),
      this.igdbProvider.search(query).catch(() => []),
    ]);

    const allResults = [...tmdbResults, ...igdbResults];
    const seen = new Set<string>();

    return allResults.filter((candidate) => {
      const key = `${candidate.title.toLowerCase()}-${candidate.mediaType}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async getWorkDetails(sourceId: string, sourceType: string): Promise<WorkDetailsDTO> {
    if (sourceType === 'IGDB') {
      return this.igdbProvider.getDetails(sourceId);
    }

    return this.tmdbProvider.getDetails(sourceId);
  }
}
