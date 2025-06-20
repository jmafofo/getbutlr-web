// File: app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function LandingPage() {
  const [userProfile, setUserProfile] = useState<any>();
  const [titleInput, setTitleInput] = useState('');
  const [suggestions, setSuggestions] = useState<any>();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return;
  
      const user = session.user;
      const { data, error: profileError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      if (!profileError) setUserProfile(data);
    }
  
    fetchProfile();
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
      <div className="min-h-screen text-white">
        <div className="max-w-5xl mx-auto px-6 pt-40 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          GetButlr
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-100 to-purple-500 bg-clip-text text-transparent"
        >
          AI-Powered Creator Growth Suite 
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 space-y-4 max-w-md mx-auto"
        >       
        <AnimatePresence mode="wait">
        {!userProfile ? (
           <>
           <motion.a
             key="quiz-cta-1"
             href="/quiz"
             initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             whileHover={{
               scale: 1.05,
               backgroundPosition: "100% 50%",  // move gradient horizontally on hover
               boxShadow: "0 0 8px rgba(129, 140, 248, 0.8)",
             }}
             transition={{
               type: "spring",
               stiffness: 300,
               damping: 20,
               backgroundPosition: { duration: 1, ease: "easeInOut" },
             }}
             className="w-full p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 bg-[length:200%_200%] text-white font-bold"
           >
             Start your journey
           </motion.a>
         
           <motion.a
             key="quiz-cta-2"
             href="/signin"
             initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             whileHover={{
               scale: 1.05,
               backgroundPosition: "100% 50%",
               boxShadow: "0 0 8px rgba(129, 140, 248, 0.8)",
             }}
             transition={{
               type: "spring",
               stiffness: 300,
               damping: 20,
               backgroundPosition: { duration: 1, ease: "easeInOut" },
             }}
             className="w-full p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 bg-[length:200%_200%] text-white font-bold mt-4 ml-5"
           >
             Login
           </motion.a>
         </>
                
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
        </motion.div>
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
        
        </div>
      </div>
  );
}

