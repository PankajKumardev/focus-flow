import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const dbCredentials = {
  host: process.env.DATABASE_HOST!,
  database: process.env.DATABASE_NAME!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  port: Number(process.env.DATABASE_PORT!),
  ssl: process.env.DATABASE_SSL === 'true',
};

const connectionString = `postgres://${dbCredentials.user}:${dbCredentials.password}@${dbCredentials.host}:${dbCredentials.port}/${dbCredentials.database}?ssl=${dbCredentials.ssl}`;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
