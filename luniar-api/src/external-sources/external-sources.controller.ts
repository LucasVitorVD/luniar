import { Controller, Get, Param } from '@nestjs/common';
import { ExternalSourcesService } from './external-sources.service.js';
import { SearchWorkDTO } from './dto/search-work.dto.js';

@Controller('external-sources/api/v1')
export class ExternalSourcesController {
  constructor(private readonly externalSourcesService: ExternalSourcesService) {}

  @Get("/search")
  async searchWorks(@Param("q") { query }: SearchWorkDTO) {
    return this.externalSourcesService.searchWorks(query)
  }
}
