"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Select } from "@/components/ui/select";

export default function AudioTrendsTool() {
  const [platform, setPlatform] = useState("YouTube");
  const [audios, setAudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchTrends = async () => {
    setLoading(true);
    const res = await fetch("/api/audio-trends", {
      method: "POST",
      body: JSON.stringify({ platform }),
    });
    const data = await res.json();
    setAudios(data.audios);
    setLoading(false);
  };

  const filtered = audios.filter(audio =>
    audio.title.toLowerCase().includes(filter.toLowerCase()) ||
    audio.category?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">🎧 Trending Audio Detector</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Discover the latest viral sounds across TikTok, Reels, and Shorts. Results are mock data while live detection is in development.
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
          placeholder="Search sound or category..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-1/3"
        />

        <button onClick={fetchTrends} disabled={loading}>
          {loading ? "Detecting..." : "Detect Trending Audio"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="dark:bg-zinc-900">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">🎵 {item.title}</h3>
                {item.category && <a>{item.category}</a>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Used in <strong>{item.usage}</strong>
              </p>
              <a href={item.preview} target="_blank" className="text-blue-500 text-sm underline">
                Preview Audio
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-sm text-gray-500 mt-4">No matching audio found for the current filter.</p>
      )}
    </div>
  );
}