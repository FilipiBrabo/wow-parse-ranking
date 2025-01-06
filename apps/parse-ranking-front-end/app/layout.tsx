import './global.css';

import { cn, Toaster } from '@parse-ranking/shadcn-ui';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { ThemeProvider } from '../src/components/theme-provider';
import { TRPCProvider } from './_trpc/trpc-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Ranking Brasileiro - WoW Classic',
  description: 'Rank brasileiro de World of Warcraft Classic',
  verification: {
    google: 'WTHVt4kEc6HE0pkFM3poHYR5dor7usP9TwB37ZLBoKc',
  },

  keywords: [
    'world of warcraft',
    'classic',
    'brasil',
    'brasileiro',
    'ranking',
    'parse',
    'warcraft logs',
    'wow',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <TRPCProvider>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCProvider>
        <Analytics />
      </body>
    </html>
  );
}
