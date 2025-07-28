'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/src/app/utils/supabase/client'; // adjust your import path

export default function AuthPage() {
  const [authUrl, setAuthUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Construct Google OAuth URL once
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.email',
      access_type: 'offline',
      prompt: 'consent',
    });

    setAuthUrl(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);

    // Check if user already connected Google
    async function checkGoogleConnection() {
      setLoading(true);
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        setIsConnected(false);
        setLoading(false);
        return;
      }

      // Query google_tokens table by user id
      const { data, error } = await supabaseClient
        .from('google_tokens')
        .select('id') // just check existence
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
      setLoading(false);
    }

    checkGoogleConnection();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Checking connection...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Connect your Google Account</h1>
      {isConnected ? (
        <p className="text-green-500 font-semibold">Your Google account is already connected.</p>
      ) : (
        <a
          href={authUrl}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Connect Google
        </a>
      )}
    </div>
  );
}
