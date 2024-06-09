import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '../../../../src/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
