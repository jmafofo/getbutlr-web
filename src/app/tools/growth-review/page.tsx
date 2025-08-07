'use client';

import { useState } from 'react';

const mockScores = [
  { label: 'CTR', value: 6.8, median: 4.5, verdict: 'Above Avg' },
  { label: 'AVD', value: 3.2, median: 4.0, verdict: 'Needs Work' },
  { label: 'Engagement', value: 7.5, median: 6.2, verdict: 'Strong' },
  { label: 'Consistency', value: 1, median: 2, verdict: 'Low' },
  { label: 'SEO Score', value: 8.2, median: 7.0, verdict: 'Optimized' },
  { label: 'Watch:Sub Ratio', value: 1.4, median: 2.2, verdict: 'Below Median' },
];

export default function GrowthReviewTool() {
  const [url, setUrl] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setShowResults(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* <h1 className="text-3xl font-bold mb-4">📊 Channel Growth Review</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Paste your YouTube video or channel URL. We'll benchmark your content against others in your niche.
      </p>

      <div className="flex gap-2 mb-6">
        <Input
          type="url"
          placeholder="Paste video/channel URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleAnalyze}>Analyze</Button>
      </div>

      {showResults && (
        <div className="space-y-6">
          {mockScores.map((score, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold">{score.label}</h3>
                  <Badge>{score.verdict}</Badge>
                </div>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground">
                  Score: <strong>{score.value}</strong> — Median: <strong>{score.median}</strong>
                </p>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="p-4">
              <h3 className="text-md font-semibold mb-2">📈 Score Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockScores.map(s => ({ name: s.label, You: s.value, Median: s.median }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="You" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="Median" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )} */}
    </div>
  );
}
