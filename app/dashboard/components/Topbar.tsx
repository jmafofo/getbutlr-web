'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function Topbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>Welcome back, Creator 👋</h2>
      </div>
      <div className="topbar-right">
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
          {theme === 'dark' ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-700" />}
        </button>
        <div className="avatar-placeholder">👤</div>
      </div>
    </header>
  );
}

