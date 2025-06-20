'use client';
import { useState } from 'react';
import { motion } from "framer-motion";

export default function ThumbnailScorePage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const userId = '...'; // fetch from auth context
  const videoId = '...'; // pass from context or input field

  async function evaluate() {
    const res = await fetch('/api/thumbnail-score', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ user_id: userId, video_id: videoId, thumbnail_url: url }),
    });
    setResult(await res.json());
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter thumbnail image URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={evaluate}
                className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
              >
                Get Score
              </motion.button>
            </motion.div>
          </div>

      {result && (
        <div className="mt-4 space-y-2">
          <div><strong>Score:</strong> {result.score}/100</div>
          <div><strong>Feedback:</strong> {result.feedback}</div>
        </div>
      )}
    </div>
  );
}

