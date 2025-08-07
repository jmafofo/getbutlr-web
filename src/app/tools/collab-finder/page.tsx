"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function YouTubeOptimizerTool() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submitOptimization = async () => {
    if (!title || !description) {
      alert("Please enter at least a title and description.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags, description }),
      });

      const data = await res.json();
      const output = data.trends?.output || JSON.stringify(data.trends, null, 2);
      setResult(output);
    } catch (err) {
      console.error("Failed to optimize video:", err);
      setResult("An error occurred while fetching optimization tips.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">📹 YouTube Optimizer</h1>
        <p className="text-gray-400 text-sm">
          Get AI-powered suggestions to improve your YouTube video’s performance based on its metadata.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-700 p-2 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-700 p-2 rounded bg-slate-800 text-white"
          />

          <textarea
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-700 p-2 rounded bg-slate-800 text-white"
          />

          <button
            onClick={submitOptimization}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Optimize Video"}
          </button>
        </div>

        {result && (
          <div className="bg-zinc-900 p-4 rounded mt-4 text-sm text-gray-100 whitespace-pre-wrap">
            {result}
          </div>
        )}
      </motion.div>
    </div>
  );
}
