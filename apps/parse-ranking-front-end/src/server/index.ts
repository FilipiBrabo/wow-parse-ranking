import { publicProcedure, router } from './trpc';

export const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC'),
});

export type AppRouter = typeof appRouter;
