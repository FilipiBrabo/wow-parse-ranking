import './global.css';

import { cn } from '@parse-ranking/shadcn-ui';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { Header } from '../src/components/header';
import { ThemeProvider } from '../src/components/theme-provider';
import { SidebarNav } from './_components/sidebar-nav';
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
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Header />
            <main className="max-w-screen-xl py-2 mx-auto px-4 sm:px-6 lg:px-8">
              <aside className="w-[18rem] hidden lg:block flex-shrink-0 fixed overflow-y-auto bottom-0 right-auto top-16 stable-scrollbar-gutter">
                <SidebarNav />
              </aside>
              <div className="lg:pl-[20rem] h-full">{children}</div>
            </main>
          </ThemeProvider>
        </TRPCProvider>
        <Analytics />
      </body>
    </html>
  );
}
