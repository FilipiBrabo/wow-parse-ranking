import 'dotenv/config'; // make sure to install dotenv package

import type { Config } from 'drizzle-kit';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
})

const env = envSchema.parse(process.env);


export default {
  driver: 'pg',
  out: './src/database/drizzle',
  schema: './src/database/drizzle/schema.ts',
  dbCredentials: {
    connectionString: env.DATABASE_URL
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
