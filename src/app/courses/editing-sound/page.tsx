'use client';

import { useState } from 'react';
import { motion } from "framer-motion";

export default function EditingSoundCoachPage() {
  const [description, setDescription] = useState('');
  const [advice, setAdvice] = useState('');
  const [checklist, setChecklist] = useState('');
  const [finalReview, setFinalReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setAdvice('');
    setChecklist('');
    setFinalReview('');

    setTimeout(() => {
      setAdvice(
        `For your video: "${description}", here’s what Butlr suggests:\n
- Use fast cuts (2–4 seconds) for energy.\n- Add transitions like L-cuts or match cuts.\n- Consider ambient background music in a chill or upbeat tone.\n- Slight color grading with contrast bump for cinematic polish.`
      );
      setChecklist(
        `🧠 Final Review Checklist:\n
- ✅ Catchy Thumbnail that reflects title\n- ✅ Hook in first 8 seconds\n- ✅ Consistent sound levels & music\n- ✅ Caption/subtitle pass\n- ✅ End screen or CTA present\n- ✅ SEO tags and description ready`
      );
      setFinalReview(
        `🚀 Finishing Review Tips:\n
- 🔁 Replay with fresh eyes after a break\n- 🎧 Watch with and without headphones\n- 🗣 Ask a friend for feedback on pacing and clarity\n- ⏱ Upload during your audience’s peak hours\n- 🧠 Use A/B testing for thumbnail/title combos`
      );
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="col-6-m space-y-4"
        >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">🎧 Editing & Sound Design Coach</h1>
          <p className="mb-4">Describe your video project and let Butlr recommend pacing, audio, editing, and upload checklist tips.</p>
          <textarea
            className="w-full p-3 border rounded mb-4"
            rows={4}
            placeholder="Describe your video (e.g., upbeat travel vlog through Fujairah coast)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
            disabled={loading || !description.trim()}
          >
            {loading ? 'Generating...' : 'Get Editing Advice'}
          </motion.button>
        </div>
      </motion.div>
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="col-6-m space-y-4"
        >
      {advice && (
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Butlr Suggestions</h2>
          <pre className="whitespace-pre-wrap text-sm">{advice}</pre>
        </div>
      )}

      {checklist && (
        <div className="bg-slate-800 rounded-2xl shadow-md p-6 mt-2">
          <h2 className="text-lg font-semibold mb-2">Upload Checklist</h2>
          <pre className="whitespace-pre-wrap text-sm">{checklist}</pre>
        </div>
      )}

      {finalReview && (
        <div className="bg-slate-800 rounded-2xl shadow-md p-6 mt-2">
          <h2 className="text-lg font-semibold mb-2">Finishing Review</h2>
          <pre className="whitespace-pre-wrap text-sm">{finalReview}</pre>
        </div>
      )}
      </motion.div>
    </div>
  );
}
