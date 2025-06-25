'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContentPerformance() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleIdeaGenerate = async () => {
    setError('');
    setResults(null);
    const videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`);
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        setError('Video not found or invalid API key');
        return;
      }

      const stats = data.items[0].statistics;
      setResults({
        viewCount: stats.viewCount,
        impressions: 'N/A (requires YouTube Analytics API)',
        ctr: 'N/A (requires YouTube Analytics API)',
        avgViewDuration: 'N/A (requires YouTube Analytics API)',
        retentionData: [100, 90, 80, 60, 50, 30],
        tips: [
          'Use timestamps and structured segments.',
          'Improve thumbnail and title clarity.',
          'Hook your audience in the first 15 seconds.'
        ]
      });
    } catch (err) {
      setError('Error fetching data from YouTube API');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white shadow-md rounded-2xl">
      <h1 className="text-3xl font-bold mb-4">Smart Idea Generator</h1>
      <p className="mb-6 text-gray-700">Enter a niche or topic to generate content ideas.</p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=xyz123"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          onClick={handleIdeaGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {results && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Performance Metrics</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>View Count: {results.viewCount}</li>
              <li>Impressions: {results.impressions}</li>
              <li>CTR: {results.ctr}</li>
              <li>Average View Duration: {results.avgViewDuration}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Retention Curve (Simulated)</h2>
            <div className="bg-gray-200 h-32 rounded-lg flex items-end gap-1 p-1">
              {results.retentionData.map((val: number, i: number) => (
                <div
                  key={i}
                  className="bg-blue-500 rounded-sm"
                  style={{ height: `${val}%`, width: '14%' }}
                  title={`Minute ${i + 1}: ${val}%`}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Improvement Tips</h2>
            <ul className="list-disc pl-6 text-gray-700">
              {results.tips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Link href="/tools" className="text-blue-500 mt-6 inline-block">← Back to Tools</Link>
    </div>
  );
}
