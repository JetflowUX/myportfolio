'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  className?: string;
};

export function ThemeToggle({ className = '' }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const persisted = window.localStorage.getItem('theme') as 'dark' | 'light' | null;
    setTheme(persisted ?? 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('theme', next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`flex h-8 w-8 items-center justify-center border border-ink/15 text-text-tertiary transition-colors hover:border-accent-ink/50 hover:text-accent-ink ${className}`}
    >
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
