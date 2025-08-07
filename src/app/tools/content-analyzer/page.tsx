'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ContentAnalyzerPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/content-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) throw new Error('Failed to analyze content');

      const data = await res.json();
      setResult(data.trends || {});
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Content Analyzer</h1>

      <textarea
        rows={10}
        placeholder="Paste content to analyze (e.g. video transcript, description)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border rounded p-3 mb-4 text-sm"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !input.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Content'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-8">
          {result.output ? (
            <ReactMarkdown>{result.output}</ReactMarkdown>
          ) : (
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}

          {result.tips?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Tips</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {result.tips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
