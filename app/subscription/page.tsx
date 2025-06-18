'use client';
import { useState, useEffect } from 'react';

export default function SubscriptionPage() {
  const [sub, setSub] = useState<any>(null);
  useEffect(() => { fetch('/api/subscription').then(r=>r.json()).then(setSub) }, []);

  const upgrade = async () => {
    await fetch('/api/subscription', {
      method: 'POST',
      body: JSON.stringify({ user_id: sub.user_id, tier: 'trial', trial: true })
    });
    setSub(await (await fetch('/api/subscription')).json());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Subscription Plan</h1>
      <pre>{JSON.stringify(sub, null, 2)}</pre>
      {!sub?.trial_started && <button onClick={upgrade} className="btn-primary mt-4">Start 14-day Trial</button>}
    </div>
  );
}

