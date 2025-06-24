'use client';

import { useState } from 'react';

export default function ScriptCoachPage() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Conversational');
  const [goal, setGoal] = useState('Engage viewers in the first 10 seconds');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const generateScript = async () => {
    setLoading(true);
    // Simulate AI generation logic
    setTimeout(() => {
      setScript(`Here's a ${tone.toLowerCase()} intro script for a video about "${topic}" aimed to ${goal.toLowerCase()}.`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
      <h1 className="text-3xl font-bold mb-4">✍️ Script Writing Coach</h1>
      <p className="mb-4">Train with Butlr's AI to write engaging video intros, hooks, and story arcs tailored to your audience.</p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Video Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border rounded">
          <option>Conversational</option>
          <option>Energetic</option>
          <option>Dramatic</option>
        </select>
        <input
          type="text"
          placeholder="Main Goal of Script"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={generateScript}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Script'}
        </button>
      </div>

      {script && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">AI Suggested Script</h2>
          <p>{script}</p>
        </div>
      )}
      </div>
    </div>
  );
}