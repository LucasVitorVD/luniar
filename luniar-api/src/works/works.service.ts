import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from '../entities/work.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private workRepository: Repository<Work>
  ) {}

  async searchForWork(workQuery: string) {
    // 1 - procurar obras em api externas como TMDB
    // 2 - retornar resultados que cheguem perto da pesquisa

  }
}
