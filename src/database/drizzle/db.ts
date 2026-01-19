import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
});

const env = envSchema.parse(process.env);

let db: PostgresJsDatabase<typeof schema>;

if (env.NODE_ENV === 'production') {
  db = drizzle(postgres(env.DATABASE_URL), { schema });
} else {
  if (!global.db) {
    global.db = drizzle(postgres(env.DATABASE_URL), { schema });
  }

  db = global.db;
}

export { db };
