'use client';

export default function UnsubscribePage() {
  return (
    <main className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">You’ve Unsubscribed</h1>
      <p className="text-gray-600">We’re sad to see you go. You won’t receive future updates from Butlr unless you re-subscribe.</p>
    </main>
  );
}

// Path: app/preferences/page.tsx

'use client';
import { useState } from 'react';

export default function PreferencesPage() {
  const [frequency, setFrequency] = useState('weekly');
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save preferences to Supabase (or mock)
    setSaved(true);
  }

  return (
    <main className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Email Preferences</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-left">
          <span className="text-gray-700">How often should we email you?</span>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="block w-full mt-1 border rounded p-2"
          >
            <option value="weekly">Weekly digest</option>
            <option value="monthly">Monthly only</option>
            <option value="never">Never (pause all)</option>
          </select>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
        {saved && <p className="text-green-600">Preferences saved!</p>}
      </form>
    </main>
  );
}

