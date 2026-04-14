'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  // Ye Next.js ko confuse hone (hydration error) se rokkega
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider 
  attribute="class" 
  defaultTheme="system" // 👈 Default dark rakho testing ke liye
  enableSystem={true} // 👈 System setting ko ignore maaro abhi
>
  {children}
</NextThemesProvider>
  );
}