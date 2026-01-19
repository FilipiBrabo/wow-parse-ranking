import 'dotenv/config'; 

import { defineConfig } from 'drizzle-kit';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);

export default defineConfig({
  dialect: 'postgresql',
  out: './src/database/drizzle',
  schema: './src/database/drizzle/schema.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
