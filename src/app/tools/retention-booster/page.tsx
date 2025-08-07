
'use client';

import { useState } from 'react';

export default function RetentionBoosterPage() {
  const [script, setScript] = useState('');
  const [audienceType, setAudienceType] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/retention-booster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, audienceType })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      setResult('Error generating retention tips.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* <h1 className="text-3xl font-bold">Retention Booster</h1>
      <p className="text-muted-foreground">Get tips to improve retention based on your script and audience.</p>

      <div className="space-y-4">
        <div>
          <Label>Target Audience Type</Label>
          <Textarea
            placeholder="e.g., Gamers, Cooking Enthusiasts, Tech Review Fans..."
            value={audienceType}
            onChange={(e) => setAudienceType(e.target.value)}
          />
        </div>

        <div>
          <Label>Paste Your Video Script</Label>
          <Textarea
            placeholder="Paste your full video script here..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Boosting...' : 'Boost Retention'}
        </Button>
      </div>

      {result && (
        <div className="bg-muted p-4 rounded border">
          <h2 className="font-semibold mb-2">Retention Suggestions:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )} */}
    </div>
  );
}
