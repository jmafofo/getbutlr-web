'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSupabaseSession from '@/app/hooks/useSupabaseSession';

export default function SubscriptionPage() {
  const session = useSupabaseSession();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSub = async () => {
      if (!session?.access_token) return;

      const res = await fetch('/api/subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setSub(data);
    };

    fetchSub();
  }, [session]);

  const upgrade = async () => {
    if (!session?.access_token || !sub?.user_id) return;

    setLoading(true);

    await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        tier: 'pro',
        plan: 'monthly',
        trial: true
      }),
    });

    const res = await fetch('/api/subscription', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const updated = await res.json();
    setSub(updated);
    setLoading(false);
  };

  const plans = [
    {
      name: 'Free Plan',
      price: '$0/month',
      features: ['Basic Access', 'Limited Projects', 'Community Support'],
      gradient: 'from-green-500 to-lime-600',
      tierKey: 'free',
    },
    {
      name: 'Pro Plan - 14 days trial',
      price: '(∞)',
      features: ['14 Projects', 'Priority Support', 'AI Enhancements'],
      gradient: 'from-purple-500 to-pink-600',
      tierKey: 'trial',
    },
    {
      name: 'Pro Plan',
      price: '$12/month',
      features: ['Unlimited Projects', 'Priority Support', 'AI Enhancements'],
      gradient: 'from-purple-500 to-pink-600',
      tierKey: 'pro',
      onClick: upgrade,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-8 p-5">
      {plans.map((plan, idx) => {
        const isCurrent = sub?.tier?.toLowerCase() === plan.tierKey;
        return (
          <div key={idx} className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <p className="text-yellow-300 font-semibold">{plan.price}</p>
              <ul className="text-white space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>✅</span> {feature}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={!isCurrent ? { scale: 1.03 } : {}}
                whileTap={!isCurrent ? { scale: 0.98 } : {}}
                disabled={isCurrent || loading}
                onClick={plan.onClick}
                className={`w-full p-3 rounded bg-gradient-to-r ${plan.gradient} text-white font-bold ${
                  isCurrent ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isCurrent
                  ? 'Current Plan'
                  : plan.tierKey === 'pro'
                  ? loading
                    ? 'Upgrading...'
                    : 'Upgrade Now'
                  : 'Get Started'}
              </motion.button>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
