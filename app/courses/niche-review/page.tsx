'use client';

import { useState } from 'react';

const questions = [
  {
    id: 1,
    question: 'What type of content do you create?',
    placeholder: 'e.g., tech reviews, cooking tutorials, travel vlogs'
  },
  {
    id: 2,
    question: 'Who is your target audience?',
    placeholder: 'e.g., beginner cooks, gamers, fitness enthusiasts'
  },
  {
    id: 3,
    question: 'What platforms do you currently post on?',
    placeholder: 'e.g., YouTube, TikTok, Instagram Reels'
  }
];

export default function NicheReviewPage() {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [insights, setInsights] = useState<string>('');

  const handleChange = (id: number, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulated API call - replace with real AI prompt call
    const summary = `Analyzing niche: ${responses[1] || 'N/A'} for audience: ${responses[2] || 'N/A'} on platforms: ${responses[3] || 'N/A'}`;
    setTimeout(() => {
      setInsights(summary);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">🔍 Guided Niche Review</h1>
        <p className="mb-6">Answer a few questions and let Butlr analyze trends, competition, and opportunities in your content area.</p>

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block font-medium mb-1">{q.question}</label>
              <input
                type="text"
                placeholder={q.placeholder}
                value={responses[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? 'Analyzing...' : 'Get Niche Insight'}
          </button>
        </div>
            </div>
            
        {insights && (
         <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Butlr Insight</h2>
            <p>{insights}</p>
          </div>
        )}
        </div>
    </div>
  );
}