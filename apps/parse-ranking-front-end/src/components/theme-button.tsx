'use client';

import { Button } from '@parse-ranking/shadcn-ui';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeButton() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
    >
      {theme === 'dark' ? <Sun size="20" /> : <Moon size="20" />}
    </Button>
  );
}
