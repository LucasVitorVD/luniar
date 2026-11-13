import { Controller } from '@nestjs/common';
import { WorksService } from './works.service.js';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}
}
