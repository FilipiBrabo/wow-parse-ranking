import './global.css';

import { cn } from '@parse-ranking/shadcn-ui';
import { Analytics } from '@vercel/analytics/react';
import { Inter as FontSans } from 'next/font/google';

import { Header } from '../src/components/header';
import { ThemeProvider } from '../src/components/theme-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Ranking Brasileiro - WoW Classic',
  description: 'Rank brasileiro de World of Warcraft Classic',
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
          <main className="flex justify-center mx-6 my-4">
            <div className="max-w-2xl flex-1">{children}</div>
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
