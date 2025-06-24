'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

let activityTimeout: NodeJS.Timeout;

const EXEMPT_ROUTES = ['/', '/signin', '/signup', '/login'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
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

    const currentTime = Date.now() / 1000; // seconds
    const expiresIn = session.expires_at ?? 0;
    const bufferTime = 60;

    if (expiresIn - currentTime <= bufferTime) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        router.push('/signin');
      }
    }

    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (EXEMPT_ROUTES.includes(pathname)) {
      setIsLoading(false);
      return;
    }

    checkSession();

    // 🔁 Real-time session handling
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth Event]', event);

      if (event === 'SIGNED_OUT') {
        router.push('/signin');
      }     

      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setIsLoading(false);
      }
    });

    const handleActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        checkSession();
      }, 30 * 1000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearTimeout(activityTimeout);
      listener?.subscription.unsubscribe();
    };
  }, [pathname, checkSession]);

  if (isLoading) {
    return (
      <div className="text-white text-center mt-20">
        <video
          autoPlay
          loop
          muted
          className="w-54 h-54 object-contain overflow-hidden"
          style={{ backgroundColor: "transparent" }}
        >
          <source src="/loading_page.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return <>{children}</>;
}
