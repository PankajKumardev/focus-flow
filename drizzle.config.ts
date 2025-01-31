import { config } from 'dotenv';
config();

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    database: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    port: Number(process.env.DATABASE_PORT!),
    ssl: process.env.DATABASE_SSL === 'true', 
  },
};
