'use client';

import { useState } from 'react';

export default function TitleRewriterPage() {
  const [inputTitle, setInputTitle] = useState('');
  const [rewrites, setRewrites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleRewrite() {
    setLoading(true);
    try {
      const res = await fetch('/api/title-rewriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: inputTitle }),
      });
      const data = await res.json();
      setRewrites(data.rewrites || []);
    } catch (err) {
      console.error('Error rewriting title:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Apple-style title */}
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
        🎯 Title Rewriter
      </h1>
      <p className="text-base text-gray-500 dark:text-gray-400 mb-8">
        Enter your current video title and get improved, high-performing alternatives.
      </p>

      {/* Input + button */}
      <div className="flex space-x-3 mb-10">
        <input
          type="text"
          placeholder="Paste your current video title..."
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          onClick={handleRewrite}
          disabled={loading || !inputTitle}
          className={`px-5 py-2 rounded-xl font-medium text-white transition
            ${loading || !inputTitle
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
        >
          {loading ? 'Rewriting…' : 'Rewrite'}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {rewrites.map((title, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                       shadow-sm hover:shadow-md transition"
          >
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
