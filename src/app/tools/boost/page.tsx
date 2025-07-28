// --- Enhanced Page: /tools/boost/page.tsx ---
'use client';

import { useState } from 'react';
// import RequireProAccess from '@/components/RequireProAccess';
// import { UpgradeModal } from '@/components/UpgradeModal';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent } from '@/components/ui/card';
import { VariantProps } from 'class-variance-authority';

export default function BoostToolPage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, tags, description })
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  const clearAll = () => {
    setTitle('');
    setTags('');
    setDescription('');
    setResult('');
  };

  return (
    <div className="Creator+">
      <div className="max-w-3xl mx-auto space-y-6 p-4">
        <h1 className="text-2xl font-bold">🚀 Boost Tool</h1>
        <p className="text-sm text-muted-foreground">
          Enhance your video’s visibility by optimizing titles, tags, and descriptions using AI-powered suggestions.
        </p>

        <div>
          <div className="space-y-4 pt-6">
            <input
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Enter tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <textarea
              placeholder="Enter video description"
              value={description}
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Analyzing...' : 'Boost Now'}
              </button>
              <button className="outline" onClick={clearAll}>Clear</button>
            </div>
          </div>
        </div>

        {result && (
          <div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">💡 Boost Suggestion</h2>
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md border border-muted-foreground">
                {result}
              </pre>
            </div>
          </div>
        )}

        {/* <div className={showModal} onOpenChange={setShowModal} /> */}
      </div>
    </div>
  );
}