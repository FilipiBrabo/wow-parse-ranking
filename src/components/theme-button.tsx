'use client';

import { Button, Skeleton } from '@/components/ui';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-9 w-9 rounded-2" />;
  }

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
