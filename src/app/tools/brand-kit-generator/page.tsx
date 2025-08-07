'use client';
import { useState } from 'react';

export default function BrandKitPage() {
  const [channelInfo, setChannelInfo] = useState('');
  const [brandKit, setBrandKit] = useState('');
  const [loading, setLoading] = useState(false);

  const generateBrandKit = async () => {
    setLoading(true);
    const res = await fetch('/api/brand-kit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelInfo }),
    });

    const data = await res.json();
    setBrandKit(data.brandKit);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🎨 Brand Kit Generator</h1>
      <p className="text-muted-foreground">
        Enter details about your channel (niche, tone, goals) and let Butlr generate a complete brand kit.
      </p>

      <textarea
        value={channelInfo}
        onChange={(e) => setChannelInfo(e.target.value)}
        placeholder="My channel is about tech tutorials in a fun, friendly tone..."
        rows={6}
      />
      <button onClick={generateBrandKit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Brand Kit'}
      </button>

      {brandKit && (
        <div>
          <div className="whitespace-pre-wrap p-4">
            <h2 className="text-xl font-semibold mb-2">Your Brand Kit</h2>
            {brandKit}
          </div>
        </div>
      )}
    </div>
  );
}