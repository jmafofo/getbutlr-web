"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateInsights } from "@/lib/openaiClient";
import type { User } from "@supabase/supabase-js";
import { InsightData, SavedSuggestion } from "@/types/insights";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function InsightsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState("SEO‑Rich");
  const [res, setRes] = useState<InsightData>();
  const [saved, setSaved] = useState<SavedSuggestion[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchSaved();
      }
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchSaved();
        } else {
          setSaved([]);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function run() {
    // if (!user) return;
    setLoader(true);
    const data = await generateInsights(query, tone);

    try {
      const insight = (data as { insight: string }).insight;
      const jsonBlock = insight.replace(/```json\n|\n```/g, "").trim().split("}")[0] + "}";
      const parsed = JSON.parse(jsonBlock);
      setRes(parsed);
    } catch (error) {
      console.error("Failed to parse insight JSON:", error);
    } finally {
      setLoader(false);
    }
  }

  async function fetchSaved() {
    const { data } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    setSaved(data || []);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white p-6 pt-40">
      {loader ? (
        <div className="flex justify-center py-4 mt-5">
          <video
            autoPlay
            loop
            muted
            className="w-54 h-54 object-contain overflow-hidden"
            style={{ backgroundColor: "transparent" }}
          >
            <source src="/loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Card */}
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter topic or video title"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
              />
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
              >
                {["Conversational", "Clickbait", "SEO‑Rich"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={run}
                className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
              >
                Get Insights
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchSaved}
                className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
              >
                Refresh Saved
              </motion.button>
            </motion.div>
          </div>

          {/* Result Card */}
          {res && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-800 text-white p-6 rounded-2xl shadow-md space-y-6"
            >
              <h2 className="text-xl font-bold text-purple-400">🎯 Suggestions ({tone})</h2>
              <div>
                <h3 className="font-semibold">🗝️ Keywords:</h3>
                <p className="text-sm text-slate-300">{res.keywords.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold">🏷️ Tags:</h3>
                <p className="text-sm text-slate-300">{res.tags.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold">📢 Title Variants:</h3>
                <div className="flex flex-wrap gap-3">
                  {res.title_variants.map((title: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded px-4 py-2 shadow-sm text-sm"
                    >
                      {title}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">🖼️ Thumbnail Prompt:</h3>
                <p className="text-sm text-slate-300 whitespace-pre-line">{res.thumbnail_prompt}</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Saved Results */}
      {saved.length > 0 && (
        <div className="mt-10 text-white">
          <h2 className="text-xl font-bold mb-4">📁 Saved Results</h2>
          {saved.map((item) => (
            <details key={item.id} className="border border-slate-600 bg-slate-700 p-4 mb-2 rounded text-sm">
              <summary className="cursor-pointer text-white">
                {item.query} — {new Date(item.created_at).toLocaleString()}
              </summary>
              <div className="mt-2 text-slate-300">
                <div><strong>Tone:</strong> {item.tone}</div>
                <div><strong>Keywords:</strong> {item.keywords.join(", ")}</div>
                <div><strong>Tags:</strong> {item.tags.join(", ")}</div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}