'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from '@/components/Footer'; // Optional if you want it globally
import '@/styles/global.css';
import '@/styles/dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const userPref = localStorage.getItem('theme');
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userPref === 'dark' || (!userPref && systemPref)) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <div className="dashboard-layout">
          <Sidebar />

          <div className="main-area">
            <Topbar />

            {/* Optional theme toggle button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-fixed btn"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>

            <main>{children}</main>
          </div>
        </div>

        {/* Optional Footer */}
        <Footer />
      </body>
    </html>
  );
}
