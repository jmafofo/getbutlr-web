'use client';

import { useState } from 'react';

type Report = {
  title: string;
  views: number;
  likes: number;
  commentsCount: number;
  averageWatchPercent: number;
  retentionCurve: number[];
  suggestions: string[];
};

export default function AIAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch('/app/ai_analyzer/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl: url })
    });
    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 YouTube AI Analyzer</h1>

      <input
        type="text"
        placeholder="Paste YouTube video URL or ID"
        className="border p-2 w-full mb-4"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button
        onClick={analyze}
        disabled={!url.trim() || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>

      {report && (
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded space-y-4">
          <h2 className="text-xl font-semibold">{report.title}</h2>
          <div className="flex justify-between">
            <span>Views: {report.views}</span>
            <span>Likes: {report.likes}</span>
            <span>Comments: {report.commentsCount}</span>
          </div>
          <div>
            <strong>Avg Watch %:</strong> {report.averageWatchPercent}%
          </div>
          <div>
            <strong>Retention Curve:</strong> {report.retentionCurve.join(' → ')}%
          </div>
          <div>
            <strong>Suggestions:</strong>
            <ul className="list-disc list-inside ml-4">
              {report.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

