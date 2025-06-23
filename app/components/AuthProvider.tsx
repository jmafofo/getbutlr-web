'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

let activityTimeout: NodeJS.Timeout;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session || error) {
      router.push('/signin');
      return;
    }

    // Extend session if active
    const currentTime = Date.now() / 1000; // seconds
    const expiresIn = session.expires_at ?? 0;
    const bufferTime = 60; // seconds before expiry to refresh

    if (expiresIn - currentTime <= bufferTime) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        router.push('/signin');
      }
    }

    setIsLoading(false);
  }, [router]);

  // 🟡 Check session on load
  useEffect(() => {
    checkSession();

    // 🟢 Handle session refresh on activity
    const handleActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        checkSession(); // refresh if near expiry
      }, 30 * 1000); // check every 30 seconds after interaction
    };

    // Listen to user interactions
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearTimeout(activityTimeout);
    };
  }, [checkSession]);

  if (isLoading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return <>{children}</>;
}
