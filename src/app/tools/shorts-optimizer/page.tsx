'use client';

import { useState } from 'react';

export default function ShortsOptimizer() {
  const [input, setInput] = useState('');
  const [optimized, setOptimized] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    const res = await fetch('/api/shorts-optimizer', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setOptimized(data.optimized);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shorts Optimizer</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Paste your short-form video idea/script here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleOptimize}
        disabled={loading}
      >
        {loading ? 'Optimizing...' : 'Optimize'}
      </button>
      {optimized && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Optimized Version:</h2>
          <p className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{optimized}</p>
        </div>
      )}
    </div>
  );
}