'use client';

import { useState } from 'react';

export default function ContentRecyclePage() {
  const [videoTranscript, setVideoTranscript] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/content-recycle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: videoTranscript })
    });
    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">♻️ Content Recycle Engine</h1>
      <p className="mb-4 text-muted-foreground">
        Paste a video transcript or long-form content and let Butlr turn it into Twitter threads,
        LinkedIn posts, Instagram captions, and Shorts scripts.
      </p>
      <textarea
        className="min-h-[160px] mb-4"
        placeholder="Paste your transcript or script here..."
        value={videoTranscript}
        onChange={(e) => setVideoTranscript(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? <div className="animate-spin mr-2 h-4 w-4" /> : 'Generate Cross-Platform Content'}
      </button>
      {output && (
        <div className="mt-6 whitespace-pre-wrap bg-muted p-4 rounded-lg border text-sm">
          {output}
        </div>
      )}
    </div>
  );
}
