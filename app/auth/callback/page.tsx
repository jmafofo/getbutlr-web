'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (code) {
      fetch('/api/auth/callback', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'OAuth failed');
          }
          return res.json();
        })
        .then(() => {
          router.push('/dashboard');
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('No code found in URL.');
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return <div className="p-6">Authenticating with Google...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return <div className="p-6">Authentication successful. Redirecting...</div>;
}
