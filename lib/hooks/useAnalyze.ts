import { useState } from 'react';

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function analyzeVideo(title: string, description: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error('Analyze error:', err);
    } finally {
      setLoading(false);
    }
  }

  return { analyzeVideo, result, loading };
}

