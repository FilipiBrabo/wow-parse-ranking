'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { ReactNode, useState } from 'react';
import { z } from 'zod';

import { trpc } from './client';

interface TRPCProviderProps {
  children: ReactNode;
}
const env = z
  .object({
    NEXT_PUBLIC_API_URL: z.string(),
    VERCEL_URL: z.string().optional(),
  })
  .parse({ NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Vercel preview deployments
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }
  // Fallback
  return env.NEXT_PUBLIC_API_URL;
};

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
