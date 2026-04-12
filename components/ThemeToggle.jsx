'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // 🎯 resolvedTheme use kiya hai taaki 'system' setting mein bug na aaye
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Actual theme kya chal rahi hai wo nikalne ke liye:
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-full bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 transition-all text-neutral-800 dark:text-white flex items-center justify-center shadow-inner"
      aria-label="Toggle Dark Mode"
    >
      {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}