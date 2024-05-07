import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { rankRouter } from './routers/rank';
import { createCallerFactory, publicProcedure, router } from './trpc';

export const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC'),
  rank: rankRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
