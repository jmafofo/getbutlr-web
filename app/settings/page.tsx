'use client';

import { useEffect, useState } from 'react';

export default function AuthPage() {
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.email',
      access_type: 'offline',
      prompt: 'consent',
    });

    setAuthUrl(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Connect your Google Account</h1>
      <a
        href={authUrl}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Connect Google
      </a>
    </div>
  );
}
