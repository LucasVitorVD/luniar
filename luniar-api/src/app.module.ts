import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WorksModule } from './works/works.module.js';
import { Content } from './entities/content.entity.js';
import { Work } from './entities/work.entity.js';
import { Material } from './entities/material.entity.js';
import { Relation } from './entities/relation.entity.js';
import { Trail } from './entities/trail.entity.js';
import { TrailItem } from './entities/trail-item.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? "localhost",
      port: Number(process.env.DATABASE_PORT) ?? 5432,
      username: process.env.DATABASE_USERNAME ?? "postgres",
      password: process.env.DATABASE_PASSWORD ?? "postgres",
      database: process.env.DATABASE_NAME ?? "luniar-test-db",
      entities: [Content, Work, Material, Relation, Trail, TrailItem],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
    WorksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
