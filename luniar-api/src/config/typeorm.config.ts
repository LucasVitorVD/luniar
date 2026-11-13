import { DataSourceOptions } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT) ?? 5432,
  username: process.env.DATABASE_USERNAME ?? 'luniar',
  password: process.env.DATABASE_PASSWORD ?? 'luniar_1226',
  database: process.env.DATABASE_NAME ?? 'luniar-db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
};
