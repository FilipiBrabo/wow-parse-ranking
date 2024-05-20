import 'dotenv/config'; // make sure to install dotenv package

import { Config, defineConfig } from 'drizzle-kit';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);

export default {
  dialect: 'postgresql',
  out: './apps/parse-ranking-front-end/src/database/drizzle',
  schema: './apps/parse-ranking-front-end/src/database/drizzle/schema.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
};
