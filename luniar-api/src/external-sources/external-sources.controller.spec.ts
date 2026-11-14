import { Test, TestingModule } from '@nestjs/testing';
import { ExternalSourcesController } from './external-sources.controller.js';

describe('ExternalSourcesController', () => {
  let controller: ExternalSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalSourcesController],
    }).compile();

    controller = module.get<ExternalSourcesController>(ExternalSourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
