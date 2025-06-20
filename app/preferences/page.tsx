'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';
import Footer from '@/components/Footer';

export default function PreferencesPage() {
  const session = useSession();
  const [frequency, setFrequency] = useState('weekly');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrefs() {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from('user_preferences')
        .select('email_frequency')
        .eq('user_id', session.user.id)
        .single();

      if (data?.email_frequency) setFrequency(data.email_frequency);
      setLoading(false);
    }
    fetchPrefs();
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) return;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: session.user.id,
        email_frequency: frequency
      });

    if (!error) setSaved(true);
  }

  if (loading) return <div className="p-8 text-center">Loading preferences...</div>;

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow max-w-xl mx-auto p-8 text-center">
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
      </div>
      <Footer />
    </main>
  );
}

