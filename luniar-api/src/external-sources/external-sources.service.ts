import { Injectable } from '@nestjs/common';
import { WorkCandidateDTO } from './dto/work-candidate.dto.js';
import { TmdbProvider } from './providers/tmdb.provider.js';

@Injectable()
export class ExternalSourcesService {
  constructor(private readonly tmdbProvider: TmdbProvider) {}

  async searchWorks(query: string): Promise<WorkCandidateDTO[]> {
    return this.tmdbProvider.search(query)
  }

  // async getWorkDetails(sourceId: string, sourceType: string): Promise<WorkDetails> {}
}
