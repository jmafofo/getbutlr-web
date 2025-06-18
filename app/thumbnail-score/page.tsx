'use client';
import { useState } from 'react';

export default function ThumbnailScorePage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const userId = '...'; // fetch from auth context
  const videoId = '...'; // pass from context or input field

  async function evaluate() {
    const res = await fetch('/api/thumbnail-score', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ user_id: userId, video_id: videoId, thumbnail_url: url }),
    });
    setResult(await res.json());
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Thumbnail Scoring</h1>
      <input
        className="border p-2 w-full"
        placeholder="Enter thumbnail image URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button onClick={evaluate} className="btn-primary">Evaluate Thumbnail</button>

      {result && (
        <div className="mt-4 space-y-2">
          <div><strong>Score:</strong> {result.score}/100</div>
          <div><strong>Feedback:</strong> {result.feedback}</div>
        </div>
      )}
    </div>
  );
}

