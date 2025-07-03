
'use client';
import { useState } from 'react';

export default function ThumbnailGenerator() {
  const [prompt, setPrompt] = useState('');
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setThumbnails([]);

    const res = await fetch('/app/butlr_thumbnails/api/generateThumbnails', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setThumbnails(data.thumbnails || []);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📸 Thumbnail Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={3}
        placeholder="Describe your thumbnail or paste video title/idea"
      />
      <button onClick={generate} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Generating...' : 'Generate Thumbnails'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {thumbnails.map((thumb, i) => (
          <div key={i} className="border p-2 rounded shadow">
            <img src={thumb.url} alt={`Generated ${i + 1}`} className="w-full h-auto rounded mb-2" />
            <p className="text-sm">Suggested Text: {thumb.text}</p>
            <p className="text-sm font-semibold">Score: {thumb.score}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
