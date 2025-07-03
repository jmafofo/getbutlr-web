'use client';

import { useState } from 'react';

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
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎧 Editing & Sound Design Coach</h1>
      <p className="mb-4">Describe your video project and let Butlr recommend pacing, audio, editing, and upload checklist tips.</p>

      <textarea
        className="w-full p-3 border rounded mb-4"
        rows={4}
        placeholder="Describe your video (e.g., upbeat travel vlog through Fujairah coast)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading || !description.trim()}
      >
        {loading ? 'Generating...' : 'Get Editing Advice'}
      </button>

      {advice && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Butlr Suggestions</h2>
          <pre className="whitespace-pre-wrap text-sm">{advice}</pre>
        </div>
      )}

      {checklist && (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Upload Checklist</h2>
          <pre className="whitespace-pre-wrap text-sm">{checklist}</pre>
        </div>
      )}

      {finalReview && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Finishing Review</h2>
          <pre className="whitespace-pre-wrap text-sm">{finalReview}</pre>
        </div>
      )}
    </main>
  );
}

