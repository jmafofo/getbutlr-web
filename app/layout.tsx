'use client';

import { useEffect, useState, PropsWithChildren } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ChatWidget from '@/lib/ChatWidget';
import { initAuthListener } from '@/lib/authListener';
import '../styles/globals.css';
import { LogAnalyticsPageView } from '@/lib/LogAnalytics';
import Footer from '@/components/Footer';

function BillingBanner() {
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/subscription');
      const json = await res.json();
      setSub(json);
    }
    load();
  }, []);

  if (!sub || sub.tier !== 'trial' || !sub.trial_expires) return null;

  const now = new Date();
  const expires = new Date(sub.trial_expires);
  const diffDays = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return (
      <div className="bg-yellow-200 p-2 text-center">
        Your free trial ends in {diffDays} day{diffDays !== 1 ? 's' : ''}.{' '}
        <a href="/subscription" className="underline font-semibold">Upgrade now</a>
      </div>
    );
  }
  return null;
}

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initAuthListener();
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = async () => {
    const html = document.documentElement;
    const next = isDark ? 'light' : 'dark';
    if (next === 'dark') {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(!isDark);

    const user = await supabase.auth.getUser();
    if (user.data?.user?.id) {
      await supabase.from('user_preferences').upsert({
        user_id: user.data.user.id,
        theme: next,
        updated_at: new Date().toISOString(),
      });
    }
  };

  return (
    <html lang="en">
      <head>
        <title>GetButlr</title>
        <meta name="description" content="AI‑powered growth tools for creators" />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <LogAnalyticsPageView />
        <BillingBanner />
        <main className="flex-grow relative">
          <button
            onClick={toggleTheme}
            className="fixed bottom-4 right-4 z-50 bg-gray-300 dark:bg-gray-700 text-sm px-4 py-2 rounded-full shadow hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {isDark ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}

