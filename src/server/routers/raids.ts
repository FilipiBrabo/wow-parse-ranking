import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../../database/drizzle/db';
import { partition, raid } from '../../database/drizzle/schema';
import { publicProcedure, router } from '../trpc';

export const raidsRouter = router({
  listPartitions: publicProcedure
    .input(
      z.object({
        raidSlug: z.string(),
      })
    )
    .query(
      async ({ input }) =>
        await db
          .select()
          .from(partition)
          .where(
            eq(
              partition.raidId,
              db
                .select({ id: raid.id })
                .from(raid)
                .where(eq(raid.slug, input.raidSlug))
            )
          )
          .orderBy((partition) => partition.wclId)
    ),
  getRaid: publicProcedure.input(z.object({ slug: z.string() })).query(
    async ({ input }) =>
      await db
        .select()
        .from(raid)
        .where(eq(raid.slug, input.slug))
        .then(([raid]) => {
          if (!raid) {
            throw new Error('Raid not found');
          }
          return raid;
        })
  ),
});
