'use client';

import { useState } from 'react';
import { useAnalyze } from '@/lib/hooks/useAnalyze';

export default function AnalyzePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { analyzeVideo, result, loading } = useAnalyze();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Video Analyzer</h1>
      <div className="space-y-4">
        <input
          className="w-full border p-3 rounded text-lg"
          type="text"
          placeholder="Enter video title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-3 rounded text-lg"
          rows={4}
          placeholder="Enter video description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => analyzeVideo(title, description)}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {result && (
        <div className="mt-8 p-6 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

