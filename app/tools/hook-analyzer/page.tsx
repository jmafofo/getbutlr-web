
'use client';

import { useState } from 'react';
import ToolHeader from '@/components/ToolHeader';

export default function HookAnalyzerPage() {
  const [hookText, setHookText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!hookText.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/hook-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hookText }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <ToolHeader
        icon="📢"
        title="Hook Analyzer"
        description="Test your video hook or intro to see how effective and compelling it is."
      />

      <textarea
        className="tool-textarea"
        rows={4}
        value={hookText}
        onChange={(e) => setHookText(e.target.value)}
        placeholder="Paste your video hook here..."
      />

      <button className="tool-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Hook'}
      </button>

      {result && (
        <div className="tool-result">
          <h4>Analysis Result</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
