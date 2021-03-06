import { PoolConfig } from 'pg';
import pg from 'pg';

export const poolConfig: PoolConfig = {
  user: process.env.DatabaseUser || 'postgres',
  password: process.env.DatabasePassword || 'postgres',
  host: process.env.DatabaseHost,
  database: process.env.DatabaseName || 'postgres',
  port: parseInt(process.env.DatabasePort || '5432', 10),
  ssl: process.env.DatabaseUser ? true : false,
};

console.log(poolConfig);

export const pool = new pg.Pool(poolConfig);
