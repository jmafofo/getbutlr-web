'use client';

import { useState } from 'react';

export default function EndscreenOptimizerPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const optimizeEndscreen = async () => {
    setLoading(true);
    const res = await fetch('/api/endscreen-optimizer', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setResult(data.optimized);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* <Card>
        <CardContent className="space-y-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Endscreen Optimizer
          </h1>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your current endscreen section or content cues..."
          />
          <Button onClick={optimizeEndscreen} disabled={loading}>
            {loading ? 'Optimizing...' : 'Generate Optimized Endscreen'}
          </Button>
          {result && (
            <div className="bg-muted p-4 rounded-md">
              <h2 className="font-semibold mb-2">Optimized Endscreen Strategy:</h2>
              <p className="whitespace-pre-line">{result}</p>
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
