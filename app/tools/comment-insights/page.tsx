'use client';

import { useState } from 'react';

export default function CommentInsights() {
  const [commentsText, setCommentsText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/comment-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentsText })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze comments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h1 className="tool-title">🧠 Comment Insights</h1>
      <p className="tool-description">Paste your YouTube comments below and get AI-powered sentiment and feedback analysis.</p>
      
      <textarea
        className="input-textarea"
        rows={10}
        placeholder="Paste comments here..."
        value={commentsText}
        onChange={(e) => setCommentsText(e.target.value)}
      />

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Comments'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {analysis && (
        <div className="analysis-output">
          <h2>Summary</h2>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}