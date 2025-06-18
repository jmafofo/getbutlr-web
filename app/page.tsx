// File: app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function LandingPage() {
  const [userProfile, setUserProfile] = useState<any>();
  const [titleInput, setTitleInput] = useState('');
  const [suggestions, setSuggestions] = useState<any>();

  useEffect(() => {
    const session = supabase.auth.session();
    const user = session?.user;
    if (!user) return;
    supabase.from('creator_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => setUserProfile(data));
  }, []);

  async function analyze() {
    if (!userProfile) return;
    const res = await fetch('/api/analyze-title', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userProfile.user_id,
        original_title: titleInput,
        tone: userProfile.tone_preference,
        style: userProfile.content_style,
      }),
    });
    setSuggestions(await res.json());
  }

  return (
    <main className="p-8 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold"
      >
        GetButlr: AI-Powered Title Assistant
      </motion.h1>

      <AnimatePresence mode="wait">
      {!userProfile ? (
        <motion.a
          key="quiz-cta"
          href="/quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          className="btn-primary px-6 py-3 bg-green-600 text-white rounded"
        >
          Start Quiz
        </motion.a>
      ) : (
        <motion.div
          key="analyzer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Type your video title idea..."
            className="border p-3 w-full"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
          />
          <motion.button
            onClick={analyze}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary px-6 py-3 bg-blue-600 text-white rounded"
          >
            Analyze Title
          </motion.button>
        </motion.div>
      )}
      </AnimatePresence>

      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-100 p-4 rounded space-y-4"
        >
          <h2 className="text-2xl font-semibold">Title Suggestions</h2>
          <ul className="list-disc ml-4">
            {suggestions.generated_titles.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <h3 className="font-medium">Trending Examples:</h3>
          <ul className="list-disc ml-4">
            {suggestions.trend_stats.map((v: any, i: number) => (
              <li key={i}>
                “{v.title}” – {v.views} views, {v.likes} likes
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </main>
  );
}

