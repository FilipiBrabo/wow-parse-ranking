import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { createCallerFactory, publicProcedure, router } from './trpc';

export const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC'),
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
