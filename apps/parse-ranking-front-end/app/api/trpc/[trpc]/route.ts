import { NextResponse } from 'next/server';

const handler = (req: Request) => new NextResponse('Hello');
// fetchRequestHandler({
//   endpoint: '/api/trpc',
//   req,
//   router: appRouter,
//   createContext: () => ({}),
// });

export { handler as GET, handler as POST };
