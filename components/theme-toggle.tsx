'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a placeholder button while mounting
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-full bg-transparent 
          transition-all duration-300 ease-in-out
          opacity-50"
      >
        <div className="h-6 w-6 rounded-full bg-primary/50 animate-pulse" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-10 h-10 rounded-full bg-transparent 
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        ${
          theme === 'light'
            ? 'hover:bg-amber-100/20 hover:shadow-[0_0_30px_#FB923C]'
            : 'hover:bg-[var(--frozen-turquoise)]/20 hover:shadow-[0_0_40px_var(--frozen-turquoise)]'
        }
        group z-50`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <Sun
          className="h-6 w-6 transition-all duration-500 ease-out
          sun-icon text-amber-500 group-hover:text-orange-500
          group-hover:rotate-180 group-active:rotate-[360deg]
          [filter:drop-shadow(0_0_10px_rgba(251,146,60,0.5))]
          group-hover:[filter:drop-shadow(0_0_15px_rgba(251,146,60,0.7))]"
        />
      ) : (
        <Moon
          className="h-6 w-6 transition-all duration-500 ease-out
          text-[#6366f1] group-hover:text-[#818cf8]
          group-hover:-rotate-180 group-active:rotate-[360deg]
          [filter:drop-shadow(0_0_12px_rgba(99,102,241,0.6))]
          group-hover:[filter:drop-shadow(0_0_20px_rgba(129,140,248,0.8))]"
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
