'use client';

import { useState } from 'react';

export default function TagRankerPage() {
  const [tagsText, setTagsText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    const res = await fetch('/api/tag-ranker', {
      method: 'POST',
      body: JSON.stringify({ tagsText }),
    });
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* <h1 className="text-2xl font-bold mb-4">🏷️ Tag Ranker</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Paste your current YouTube tags and let AI evaluate their SEO performance and relevance.
      </p>

      <Textarea
        placeholder="e.g. fishing, abu dhabi, tuna catch, black pearl charters..."
        rows={3}
        className="mb-4"
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
      />
      <Button onClick={handleAnalyze} disabled={loading || !tagsText}>
        {loading ? 'Analyzing...' : 'Analyze Tags'}
      </Button>

      <div className="mt-6 space-y-4">
        {results.map((tag: any, idx: number) => (
          <TagScoreCard key={idx} {...tag} />
        ))}
      </div> */}
    </div>
  );
}
