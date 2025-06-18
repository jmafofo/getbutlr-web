'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SubscriptionPage() {
  const [sub, setSub] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getSessionAndSub = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      setToken(session.access_token);

      const res = await fetch('/api/subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setSub(data);
    };

    getSessionAndSub();
  }, []);

  const upgrade = async () => {
    if (!token || !sub?.user_id) return;

    await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: sub.user_id, tier: 'trial', trial: true }),
    });

    const res = await fetch('/api/subscription', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSub(await res.json());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Subscription Plan</h1>
      <pre>{JSON.stringify(sub, null, 2)}</pre>
      {!sub?.trial_started && (
        <button onClick={upgrade} className="btn-primary mt-4">
          Start 14-day Trial
        </button>
      )}
    </div>
  );
}
