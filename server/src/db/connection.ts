import { PoolConfig } from 'pg';
import pg from 'pg';

export const poolConfig: PoolConfig = {
  user: 'postgres',
  password: 'postgres',
  host: process.env.DatabaseHost,
  database: 'postgres',
}

export const pool = new pg.Pool(poolConfig);
