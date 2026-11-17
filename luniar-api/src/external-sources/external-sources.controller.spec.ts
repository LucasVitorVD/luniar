import { Test, TestingModule } from '@nestjs/testing';
import { ExternalSourcesController } from './external-sources.controller.js';
import { ExternalSourcesService } from './external-sources.service.js';
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
