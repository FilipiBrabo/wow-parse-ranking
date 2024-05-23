import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';

import * as schema from './schema';

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);

const client = postgres(env.DATABASE_URL);

// { schema } is used for relational queries
export const db = drizzle(client, { schema });
