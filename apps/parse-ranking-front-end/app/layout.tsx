import './global.css';

import { cn } from '@parse-ranking/shadcn-ui';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { Header } from '../src/components/header';
import { ThemeProvider } from '../src/components/theme-provider';
import { SidebarNav } from './_components/sidebar-nav';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Header />
          <main className="flex mx-auto max-w-screen-xl px-6 md:px-8">
            <aside className="w-80 hidden lg:block flex-shrink-0">
              <SidebarNav />
            </aside>
            <div className="flex-1">{children}</div>
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
