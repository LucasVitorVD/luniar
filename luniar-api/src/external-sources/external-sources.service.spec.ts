import { Test, TestingModule } from '@nestjs/testing';
import { ExternalSourcesController } from './external-sources.controller.js';
import { ExternalSourcesService } from './external-sources.service.js';
import { TmdbProvider } from './providers/tmdb.provider.js';
import { IgdbProvider } from './providers/igdb.provider.js';
import { IgdbAuthService } from './services/igdb-auth.service.js';
import { HttpClientModule } from '@nestjs/http-client';
import { WorkCandidateDTO } from './dto/work-candidate.dto.js';
import { WorkDetailsDTO } from './dto/work-details.dto.js';

const mockTmdbSearchResult: WorkCandidateDTO = new WorkCandidateDTO(
  'movie:550',
  'Fight Club',
  'movie',
  '1999-10-15',
  '/poster.jpg',
  'TMDB'
);

const mockIgdbSearchResult: WorkCandidateDTO = new WorkCandidateDTO(
  '12345',
  'Cyberpunk 2077',
  'game',
  '2020-12-10',
  '/cover.jpg',
  'IGDB'
);

const mockTmdbDetailsResult: WorkDetailsDTO = new WorkDetailsDTO(
  'movie:550',
  'TMDB',
  'Fight Club',
  'Um filme sobre clubes de luta',
  '/poster.jpg',
  '/backdrop.jpg',
  '1999-10-15',
  'David Fincher'
);

const mockIgdbDetailsResult: WorkDetailsDTO = new WorkDetailsDTO(
  '12345',
  'IGDB',
  'Cyberpunk 2077',
  'Um jogo de mundo aberto futurista',
  '/cover.jpg',
  '/cover.jpg',
  '2020-12-10'
);

describe('ExternalSourcesController', () => {
  let controller: ExternalSourcesController;
  let service: ExternalSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpClientModule.register({ name: 'tmdb' })],
      controllers: [ExternalSourcesController],
      providers: [
        {
          provide: ExternalSourcesService,
          useValue: {
            searchWorks: vi.fn().mockResolvedValue([mockTmdbSearchResult, mockIgdbSearchResult]),
            getWorkDetails: vi.fn().mockResolvedValue(mockTmdbDetailsResult),
          },
        },
      ],
    }).compile();

    controller = module.get<ExternalSourcesController>(ExternalSourcesController);
    service = module.get<ExternalSourcesService>(ExternalSourcesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call searchWorks with query and return results', async () => {
    const result = await controller.searchWorks({ query: 'Persona 5' });
    expect(service.searchWorks).toHaveBeenCalledWith('Persona 5');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(mockTmdbSearchResult);
    expect(result[1]).toEqual(mockIgdbSearchResult);
  });

  it('should call getWorkDetails with sourceId and sourceType', async () => {
    const result = await controller.getWorkDetails('movie:550', 'TMDB');
    expect(service.getWorkDetails).toHaveBeenCalledWith('movie:550', 'TMDB');
    expect(result).toEqual(mockTmdbDetailsResult);
  });

  it('should handle empty query gracefully', async () => {
    vi.spyOn(service, 'searchWorks').mockResolvedValueOnce([]);
    const result = await controller.searchWorks({ query: '' });
    expect(result).toEqual([]);
    expect(service.searchWorks).toHaveBeenCalledWith('');
  });
});

describe('ExternalSourcesService', () => {
  let service: ExternalSourcesService;
  let tmdbProvider: any;
  let igdbProvider: any;

  beforeEach(async () => {
    tmdbProvider = {
      search: vi.fn().mockResolvedValue([mockTmdbSearchResult]),
      getDetails: vi.fn().mockResolvedValue(mockTmdbDetailsResult),
    };
    igdbProvider = {
      search: vi.fn().mockResolvedValue([mockIgdbSearchResult]),
      getDetails: vi.fn().mockResolvedValue(mockIgdbDetailsResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpClientModule.register({ name: 'tmdb' })],
      providers: [
        ExternalSourcesService,
        { provide: TmdbProvider, useValue: tmdbProvider },
        { provide: IgdbProvider, useValue: igdbProvider },
      ],
    }).compile();

    service = module.get<ExternalSourcesService>(ExternalSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call both TMDB and IGDB providers in parallel and merge results', async () => {
    const result = await service.searchWorks('Persona 5');

    expect(tmdbProvider.search).toHaveBeenCalledWith('Persona 5');
    expect(igdbProvider.search).toHaveBeenCalledWith('Persona 5');
    expect(result).toHaveLength(2);
    expect(result.map(r => r.title)).toContain('Fight Club');
    expect(result.map(r => r.title)).toContain('Cyberpunk 2077');
  });

  it('should deduplicate results with same title and mediaType', async () => {
    vi.spyOn(tmdbProvider, 'search').mockResolvedValueOnce([
      mockTmdbSearchResult,
      new WorkCandidateDTO('movie:550', 'Fight Club', 'movie', '1999', '/p.jpg', 'TMDB'),
    ]);
    vi.spyOn(igdbProvider, 'search').mockResolvedValueOnce([]);

    const result = await service.searchWorks('Fight Club');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fight Club');
  });

  it('should return empty array when both providers return empty', async () => {
    vi.spyOn(tmdbProvider, 'search').mockResolvedValueOnce([]);
    vi.spyOn(igdbProvider, 'search').mockResolvedValueOnce([]);

    const result = await service.searchWorks('Obra Inexistente');

    expect(result).toEqual([]);
  });

  it('should handle TMDB provider failure gracefully', async () => {
    vi.spyOn(tmdbProvider, 'search').mockRejectedValueOnce(new Error('TMDB down'));
    vi.spyOn(igdbProvider, 'search').mockResolvedValueOnce([mockIgdbSearchResult]);

    const result = await service.searchWorks('Cyberpunk');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Cyberpunk 2077');
    expect(result[0].source).toBe('IGDB');
  });

  it('should route to TMDB provider when sourceType is not IGDB', async () => {
    await service.getWorkDetails('movie:550', 'TMDB');
    expect(tmdbProvider.getDetails).toHaveBeenCalledWith('movie:550');
    expect(igdbProvider.getDetails).not.toHaveBeenCalled();
  });

  it('should route to IGDB provider when sourceType is IGDB', async () => {
    await service.getWorkDetails('12345', 'IGDB');
    expect(igdbProvider.getDetails).toHaveBeenCalledWith('12345');
    expect(tmdbProvider.getDetails).not.toHaveBeenCalled();
  });

  it('should return TMDB details from provider', async () => {
    const result = await service.getWorkDetails('movie:550', 'TMDB');
    expect(result).toEqual(mockTmdbDetailsResult);
    expect(result.title).toBe('Fight Club');
    expect(result.externalSourceType).toBe('TMDB');
  });

  it('should return IGDB details from provider', async () => {
    const result = await service.getWorkDetails('12345', 'IGDB');
    expect(result).toEqual(mockIgdbDetailsResult);
    expect(result.title).toBe('Cyberpunk 2077');
    expect(result.externalSourceType).toBe('IGDB');
  });
});
