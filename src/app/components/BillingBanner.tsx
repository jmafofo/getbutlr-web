'use client'

import { useState, useEffect } from 'react';

export default function SignOutButton() {
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