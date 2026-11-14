import { Module } from '@nestjs/common';
import { ExternalSourcesController } from './external-sources.controller.js';
import { ExternalSourcesService } from './external-sources.service.js';
import { TmdbProvider } from './providers/tmdb.provider.js';
import { HttpClientModule } from '@nestjs/http-client';

@Module({
  imports: [
    HttpClientModule.register(
      {
        name: "tmdb",
        baseUrl: process.env.TMDB_API_URL,
        headers: {
          'Authorization': `Bearer ${process.env.TMDB_READ_TOKEN}`,
          'accept': 'application/json'
        }
      },
    ),
  ],
  controllers: [ExternalSourcesController],
  providers: [ExternalSourcesService, TmdbProvider]
})
export class ExternalSourcesModule {}
