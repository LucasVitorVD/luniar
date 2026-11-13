import { Module } from '@nestjs/common';
import { WorksService } from './works.service.js';
import { WorksController } from './works.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from '../entities/work.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Work])],
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}
