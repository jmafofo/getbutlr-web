'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const searchParams = useSearchParams();
  const router = useRouter();

  const plan = searchParams.get('plan') || 'creator';

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const user = await supabase.auth.getUser();
      if (!user?.data?.user) throw new Error('Not logged in');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.data.user.id,
          plan,
          email,
        }),
      });

      if (!res.ok) throw new Error('Failed checkout');

      setStatus('success');
      router.push('/dashboard/subscription');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div className="p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Subscribe to {plan === 'studio' ? 'Studio Pro' : 'Creator+'}</h1>
      <p className="mb-6">Enter your email to proceed with secure checkout.</p>
      <form onSubmit={handleCheckout} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          {status === 'submitting' ? 'Processing...' : 'Continue to Payment'}
        </button>
        {status === 'success' && <p className="text-green-600">Redirecting...</p>}
        {status === 'error' && <p className="text-red-600">Checkout failed. Try again.</p>}
      </form>
      <div className="mt-8 space-y-4">
        <Link href="/">
          <button className="text-sm text-blue-500 underline">← Back to Home</button>
        </Link>
        <Link href="/dashboard/subscription">
          <button className="text-sm text-blue-500 underline">Go to Subscription Dashboard →</button>
        </Link>
      </div>
    </div>
  );
}

