'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const {
    user,
    isLoading,
    isTrial,
    isTrialExpired,
    isSubscriber,
    isPaidExpired,
    subscription,
  } = useAuth();

  const router = useRouter();

  const handleUpgrade = async () => {
    router.push('/checkout'); // Replace with your checkout or Stripe link
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-300">
        <h1 className="text-xl font-semibold">Loading billing details...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-red-400">
        <h1 className="text-xl font-semibold">You must be logged in to view billing.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      {isTrial && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">Trial Plan</h2>
          <p>Your trial is active.</p>
          <p>
            Expires on:{' '}
            <span className="font-medium text-white">
              {formatDate(subscription?.trial_expires)}
            </span>
          </p>
          {isTrialExpired && (
            <p className="text-red-400 font-semibold mt-2">Your trial has expired.</p>
          )}
        </div>
      )}

      {isSubscriber && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">Pro Plan</h2>
          <p>Thank you for being a subscriber!</p>
          <p>
            Valid until:{' '}
            <span className="font-medium text-white">
              {formatDate(subscription?.end_date)}
            </span>
          </p>
        </div>
      )}

      {isPaidExpired && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">Pro Plan Expired</h2>
          <p className="text-red-400 font-medium">Your paid plan has expired.</p>
        </div>
      )}

      {!isSubscriber && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpgrade}
          className="mt-6 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-md"
        >
          Upgrade to Pro
        </motion.button>
      )}
    </div>
  );
}
