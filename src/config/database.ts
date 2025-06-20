import { DataSource } from 'typeorm';
import { User } from '../data/entities/user.entity';
import { Transaction } from '../data/entities/transaction.entity';
import { envs } from './envs';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DATABASE_HOST,
  port: envs.DATABASE_PORT,
  username: envs.DATABASE_USERNAME,
  password: envs.DATABASE_PASSWORD,
  database: envs.DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Transaction],
  subscribers: [],
  migrations: [],
});
