import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { z } from 'zod';

import * as schema from './schema';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

const env = envSchema.parse(process.env);

export const client = new Client({
  connectionString: env.DATABASE_URL,
});

await client.connect();

// { schema } is used for relational queries
export const db = drizzle(client, { schema });
