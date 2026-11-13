import { Module } from '@nestjs/common';
import { WorksService } from './works.service.js';
import { WorksController } from './works.controller.js';

@Module({
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}
