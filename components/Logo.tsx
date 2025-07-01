
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Logo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');

    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    };
  }, []);

  const logoSrc = theme === 'dark' ? '/logos/getbutlr-dark.svg' : '/logos/getbutlr-light.svg';

  return (
    <Image
      src={logoSrc}
      alt="GetButlr Logo"
      width={120}
      height={40}
      className="logo"
    />
  );
}
