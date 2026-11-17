import { Module } from '@nestjs/common';
import { ExternalSourcesController } from './external-sources.controller.js';
import { ExternalSourcesService } from './external-sources.service.js';
import { TmdbProvider } from './providers/tmdb.provider.js';
import { IgdbProvider } from './providers/igdb.provider.js';
import { IgdbAuthService } from './services/igdb-auth.service.js';
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
    HttpClientModule.register(
      {
        name: "igdb-auth",
        baseUrl: "https://id.twitch.tv",
      },
    ),
    HttpClientModule.register(
      {
        name: "igdb",
        baseUrl: process.env.IGDB_API_URL
      },
    ),
  ],
  controllers: [ExternalSourcesController],
  providers: [ExternalSourcesService, TmdbProvider, IgdbProvider, IgdbAuthService]
})
export class ExternalSourcesModule {}