import { Controller, Get, Query, Param } from '@nestjs/common';
import { ExternalSourcesService } from './external-sources.service.js';
import { SearchWorkDTO } from './dto/search-work.dto.js';

@Controller('/api/v1/external-sources')
export class ExternalSourcesController {
  constructor(private readonly externalSourcesService: ExternalSourcesService) {}

  @Get("/search")
  async searchWorks(@Query() queryDto: SearchWorkDTO) {
    return this.externalSourcesService.searchWorks(queryDto.query);
  }

  @Get(":sourceId/details")
  async getWorkDetails(
    @Param("sourceId") sourceId: string,
    @Query("sourceType") sourceType: string,
  ) {
    return this.externalSourcesService.getWorkDetails(sourceId, sourceType);
  }
}
