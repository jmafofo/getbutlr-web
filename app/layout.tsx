// app/layout.tsx
'use client';

import { useEffect, PropsWithChildren } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ChatWidget from '@/lib/ChatWidget';
import { initAuthListener } from '@/lib/authListener';
import '../styles/globals.css';
import { LogAnalyticsPageView } from '@/lib/LogAnalytics';

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
  useEffect(() => {
    initAuthListener(); // Track SIGNED_IN / SIGNED_OUT via Supabase :contentReference[oaicite:6]{index=6}
  }, []);

  return (
    <html lang="en">
      <head>
        <title>GetButlr</title>
        <meta name="description" content="AI‑powered growth tools for creators" />
      </head>
      <body className="min-h-screen flex flex-col">
        <LogAnalyticsPageView /> {/* Tracks router-based page views using App Router hooks :contentReference[oaicite:7]{index=7} */}
        <BillingBanner />
        <main className="flex-grow">{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}

