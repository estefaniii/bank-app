import { DataSource } from 'typeorm';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
