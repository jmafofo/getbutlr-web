'use client';

import { useState } from 'react';
import ToolHeader from '@/components/ToolHeader';
import '@/styles/tool.css';

export default function ContentPerformancePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!videoUrl) return;
    setLoading(true);
    try {
      const response = await fetch('/api/content-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      const data = await response.json();
      setAnalysis(data.analysis || 'No insights returned.');
    } catch (err) {
      console.error(err);
      setAnalysis('Failed to analyze content.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tool-page">
      <ToolHeader
        icon="📈"
        title="Content Performance"
        description="Break down the key metrics of your content performance and understand what works."
      />
      <div className="tool-body">
        <input
          type="text"
          className="tool-input"
          placeholder="Enter YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button className="tool-button" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {analysis && <div className="tool-output"><pre>{analysis}</pre></div>}
      </div>
    </div>
  );
}