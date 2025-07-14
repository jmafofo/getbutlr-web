'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '@/app/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // adjust based on your Supabase types

type Subscription = {
  tier: string;
  status: string;
  trial_expires: string | null;
  start_date: string | null;
  end_date: string | null;
};

type AuthContextType = {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isTrial: boolean;
  isSubscriber: boolean;
  isTrialExpired: boolean;
  isPaidExpired: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSub = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (user) {
        setUser(user);

        const { data: sub, error } = await supabaseClient
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && sub) {
          setSubscription(sub as Subscription);
        }
      }

      setIsLoading(false);
    };

    fetchUserAndSub();
  }, []);

  const now = new Date();

  const isTrial = subscription?.tier === 'trial';
  const isTrialExpired =
    isTrial && subscription?.trial_expires
      ? now > new Date(subscription.trial_expires)
      : false;

  const isValidPaidSubscription =
    (subscription?.tier === 'pro' || subscription?.tier === 'paid') &&
    subscription.start_date &&
    subscription.end_date &&
    now >= new Date(subscription.start_date) &&
    now <= new Date(subscription.end_date);

  const isPaidExpired =
    (subscription?.tier === 'pro' || subscription?.tier === 'paid') &&
    subscription.end_date &&
    now > new Date(subscription.end_date);

  const isSubscriber = isValidPaidSubscription;

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isLoading,
        isTrial,
        isSubscriber,
        isTrialExpired,
        isPaidExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
