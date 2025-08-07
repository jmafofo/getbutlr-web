'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const frequencyOptions = [
  { label: '1 week', value: '1' },
  { label: '2 weeks', value: '2' },
  { label: '3 weeks', value: '3' },
];

export default function ContentCalendarPage() {
  const [topic, setTopic] = useState('');
  const [frequency, setFrequency] = useState('');
  const [style, setStyle] = useState('');
  const [calendar, setCalendar] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch('/api/content-calendar', {
      method: 'POST',
      body: JSON.stringify({ topic, frequency, style }),
    });
    const data = await res.json();
    setCalendar(data.trends?.output || '');
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">📅 Content Calendar Generator</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Plan your content week with AI-generated titles, hooks, and formats.
      </p>

      <input
        type="text"
        placeholder="Your channel topic or niche"
        className="mb-3 block w-full border rounded px-3 py-2"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Upload Frequency
        </label>
        <div className="inline-flex space-x-3">
          {frequencyOptions.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={`px-4 py-2 rounded border 
                ${
                  frequency === value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="mb-4 block w-full border rounded px-3 py-2"
      >
        <option value="" disabled>
          Select your content style
        </option>
        <option value="tutorial">Tutorial</option>
        <option value="storytelling">Storytelling</option>
        <option value="news/trending">News/Trending</option>
        <option value="product review">Product Review</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading || !topic || !frequency || !style}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Calendar'}
      </button>

      {calendar && (
        <div className="mt-6 border p-4 rounded bg-white dark:bg-zinc-900 text-sm text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{calendar}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
