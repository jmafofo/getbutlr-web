"use client";

import { useState } from "react";

export default function TagMinerTool() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (topic: string, platform: string) => {
    setLoading(true);
    const res = await fetch("/api/tag-miner", {
      method: "POST",
      body: JSON.stringify({ topic, platform }),
    });
    const data = await res.json();
    setTags(data.tags);
    setLoading(false);
  };

  const handleCopy = () => {
    const text = tags.map(t => `${t.name}, ${t.percent}%, ${t.viralityScore}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  const handleExport = () => {
    const csv = ["Tag,Percent,ViralityScore", ...tags.map(t => `${t.name},${t.percent},${t.viralityScore}`)].join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tags.csv';
    a.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Tag Miner</h1>

      <input type="text" placeholder="Enter niche/topic" className="p-2 border" id="tag-topic" />
      <select id="tag-platform" className="ml-2 p-2 border">
        <option>YouTube</option>
        <option>TikTok</option>
        <option>Instagram</option>
      </select>
      <button onClick={() => handleSubmit((document.getElementById('tag-topic') as HTMLInputElement).value, (document.getElementById('tag-platform') as HTMLSelectElement).value)} className="ml-2 p-2 bg-green-500 text-white">Mine Tags</button>

      {tags.length > 0 && (
        <div className="mt-4">
          <button onClick={handleCopy} className="p-2 text-sm bg-gray-200 mr-2">Copy</button>
          <button onClick={handleExport} className="p-2 text-sm bg-gray-200">Export CSV</button>
        </div>
      )}

      {loading ? <p className="mt-4">Loading...</p> : (
        <ul className="mt-4">
          {tags.map((t, i) => (
            <li key={i}>{t.name} – {t.percent}% viral – Score: {t.viralityScore}</li>
          ))}
        </ul>
      )}
    </div>
  );
}