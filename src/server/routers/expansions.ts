import { db } from '../../database/drizzle/db';
import { publicProcedure, router } from '../trpc';

export const expansionsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.query.expansion.findMany({
      with: { raid: true },
      orderBy: (expansion, { desc }) => [desc(expansion.id)],
    });
  }),
});
