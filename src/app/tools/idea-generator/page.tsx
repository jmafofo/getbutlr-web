'use client';

import { useState } from 'react';

export default function IdeaGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [error, setError] = useState('');

  const generateIdeas = async () => {
    setLoading(true);
    setIdeas([]);
    setError('');

    try {
      const res = await fetch('/api/idea-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate ideas.');
      }

      // If wrapped in { trends: { output } }, fallback
      const results = Array.isArray(data.trends)
        ? data.trends
        : data.trends.output || [];

      setIdeas(results);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🎯 Idea Generator</h1>
      
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a niche or topic..."
        className="w-full border px-4 py-2 mb-4 rounded shadow-sm"
      />

      <button
        onClick={generateIdeas}
        disabled={loading || !topic.trim()}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Ideas'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {ideas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">💡 Generated Ideas</h2>
          <div className="space-y-6">
            {ideas.map((idea, index) => (
              <div key={index} className="border p-4 rounded-xl shadow-sm bg-slate-800">
                <h3 className="text-lg font-bold mb-2">{index + 1}. {idea.title}</h3>
                <p className="text-gray-200">{idea.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
