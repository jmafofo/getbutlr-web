"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AudioTrendsTool() {
  const [platform, setPlatform] = useState("YouTube");
  const [topic, setTopic] = useState(""); // Input topic
  const [output, setOutput] = useState(""); // Text result
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/audio-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic }),
      });

      const data = await res.json();
      setOutput(data.trends?.output || "No results found.");
    } catch (err) {
      console.error("Error fetching trends:", err);
      setOutput("Error fetching data.");
    }

    setLoading(false);
  };

  return (
    <div className="p-5 min-h-screen relative">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold mb-4">🎧 Trending Audio Detector</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Discover the latest viral sounds across TikTok, Reels, and Shorts. This tool uses AI + live search to analyze what’s trending now.
            </p>

            <div className="flex flex-wrap gap-4 mb-6 items-center">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="border p-2 rounded text-sm"
              >
                <option value="YouTube">YouTube Shorts</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram Reels</option>
              </select>

              <input
                type="text"
                placeholder="Enter topic (e.g. summer, fishing)"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="border p-2 rounded text-sm w-full md:w-1/3"
              />

              <button
                onClick={fetchTrends}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading ? "Detecting..." : "Detect Trending Audio"}
              </button>
            </div>

            {output && (
              <div className="bg-zinc-900 p-4 rounded shadow text-sm whitespace-pre-wrap leading-relaxed text-gray-100">
                {output}
              </div>
            )}

            {!output && !loading && (
              <p className="text-sm text-gray-500 mt-4">No results yet. Enter a topic and click the button.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
