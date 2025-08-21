'use client';

import { useState } from 'react';

export default function TagRankerPage() {
  const [tagsText, setTagsText] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const res = await fetch('/api/tag-ranker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagsText }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Error analyzing tags:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🏷️ Tag Ranker</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Paste your current YouTube tags and let AI evaluate their SEO performance and relevance.
      </p>

      <textarea
        placeholder="e.g. fishing, abu dhabi, tuna catch, black pearl charters..."
        rows={3}
        className="w-full p-2 border rounded mb-4"
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !tagsText}
        className={`px-4 py-2 rounded text-white ${
          loading || !tagsText
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Analyzing...' : 'Analyze Tags'}
      </button>

      {/* Default results display */}
      <div className="mt-6 space-y-4">
        {results.map((tag, idx) => (
          <div
            key={idx}
            className="p-3 border rounded shadow-sm bg-white dark:bg-gray-800"
          >
            <p className="font-semibold">{tag.name || `Tag ${idx + 1}`}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Score: {tag.score ?? 'N/A'}
            </p>
            {tag.comment && (
              <p className="text-xs text-gray-500 mt-1">{tag.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
