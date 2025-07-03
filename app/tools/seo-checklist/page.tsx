
'use client';

import { useState } from 'react';
import ToolHeader from '@/components/ToolHeader';

export default function SEOChecklistPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const response = await fetch('/api/seo-checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, tags })
    });
    const data = await response.json();
    setScore(data.score);
    setSuggestions(data.suggestions);
    setLoading(false);
  };

  return (
    <div className="tool-page">
      <ToolHeader
        title="SEO Coach"
        icon="🔍"
        description="Optimize your title, description, and tags for visibility."
      />
      <div className="tool-inputs">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Paste your video title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste your video description"
        />
        <textarea
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Paste your video tags (comma separated)"
        />
        <button className="btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run SEO Check'}
        </button>
        {score !== null && (
          <div className="tool-results">
            <p><strong>SEO Score:</strong> {score}%</p>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>⚠️ {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
