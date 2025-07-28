'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="YouTube Video ID"
                value={videoId}
                onChange={e => setVideoId(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
              />
              <input
                type="text"
                placeholder="Variant A Title"
                value={variantA}
                onChange={e => setVariantA(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
              />
              <input
                type="text"
                placeholder="Variant B Title"
                value={variantB}
                onChange={e => setVariantB(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={createTest}
                className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
              >
                Start Test
              </motion.button>
            </motion.div>
      {testId && <p>Test created with ID: {testId}</p>}
      </div>
    </div>
  );
}

