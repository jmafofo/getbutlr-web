'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function GrowthReviewTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<any[]>([]);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setShowResults(false);
    try {
      const res = await fetch('/api/growth-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setScores(data.scores || []);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to analyze', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">📊 Channel Growth Review</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste your YouTube video or channel URL. We'll benchmark your content against others in your niche.
      </p>

      <div className="flex gap-2 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video/channel URL..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {showResults && (
        <div className="space-y-6">
          {scores.map((score, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">{score.label}</h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {score.verdict}
                </span>
              </div>
              <hr className="my-2" />
              <p className="text-sm text-gray-500">
                Score: <strong>{score.value}</strong> — Median: <strong>{score.median}</strong>
              </p>
            </div>
          ))}

          <div className="border border-gray-200 rounded-md p-4 shadow-sm">
            <h3 className="text-md font-semibold mb-2">📈 Score Overview</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scores.map(s => ({ name: s.label, You: s.value, Median: s.median }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="You" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="Median" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
