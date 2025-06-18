'use client';
import { useState } from 'react';

export default function ABTestPage() {
  const [videoId, setVideoId] = useState('');
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [testId, setTestId] = useState<number>();

  async function createTest() {
    const res = await fetch('/api/ab-test', {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId, variant_a_title: variantA, variant_b_title: variantB }),
      headers: { 'Content-Type': 'application/json' },
    });
    const { id } = await res.json();
    setTestId(id);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Create A/B Test</h1>
      <input placeholder="YouTube Video ID" value={videoId} onChange={e => setVideoId(e.target.value)} />
      <input placeholder="Variant A Title" value={variantA} onChange={e => setVariantA(e.target.value)} />
      <input placeholder="Variant B Title" value={variantB} onChange={e => setVariantB(e.target.value)} />
      <button onClick={createTest}>Start A/B Test</button>

      {testId && <p>Test created with ID: {testId}</p>}
    </div>
  );
}

