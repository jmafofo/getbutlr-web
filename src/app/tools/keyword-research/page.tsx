"use client";

import { useState } from "react";

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
}

export default function KeywordResearchTool() {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (topic: string) => {
    setLoading(true);
    const res = await fetch("/api/keyword-research", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setKeywords(data.keywords);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Keyword Research</h1>
      {/* Input form */}
      <input
        type="text"
        placeholder="Enter topic or niche"
        className="p-2 border"
        id="keyword-input"
      />
      <button
        onClick={() =>
          handleSubmit(
            (document.getElementById("keyword-input") as HTMLInputElement)
              .value
          )
        }
        className="ml-2 p-2 bg-blue-500 text-white"
      >
        Generate
      </button>

      {/* Results */}
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <ul className="mt-4">
          {keywords.map((k, i) => (
            <li key={i} className="mb-1">
              <strong>{k.keyword}</strong> — Volume: {k.volume}, Difficulty:{" "}
              {k.difficulty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
