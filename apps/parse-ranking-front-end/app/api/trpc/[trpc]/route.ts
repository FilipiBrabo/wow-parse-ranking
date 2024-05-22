// const handler = (req: Request) =>
//   fetchRequestHandler({
//     endpoint: '/api/trpc',
//     req,
//     router: appRouter,
//     createContext: () => ({}),
//   });

import { NextResponse } from 'next/server';

// export { handler as GET, handler as POST };

export async function GET() {
  return new NextResponse('Hello World');
}
