"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateInsights } from "@/lib/openaiClient";

export default function InsightsPage() {
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState("SEO‑Rich");
  const [res, setRes] = useState<any>();
  const [saved, setSaved] = useState<any[]>([]);

  async function run() {
    const data = await generateInsights(query, tone);
    setRes(data);
  }

  async function fetchSaved() {
    const { data } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    setSaved(data || []);
  }

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">GetButlr Insights</h1>
      <input
        type="text"
        placeholder="Enter topic or video title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full"
      />
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="border p-2"
      >
        {["Conversational", "Clickbait", "SEO‑Rich"].map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button onClick={run} className="btn-primary px-4 py-2 bg-blue-600 text-white rounded">
        Get Insights
      </button>

      {res && (
        <div className="bg-gray-100 p-4 rounded space-y-2">
          <h2>Suggestions ({tone})</h2>
          <div>
            <strong>Keywords:</strong> {res.keywords.join(", ")}
          </div>
          <div>
            <strong>Tags:</strong> {res.tags.join(", ")}
          </div>
          <div>
            <strong>Titles:</strong>
            <ul className="list-disc ml-6">
              {res.title_variants.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Thumbnail Prompt:</strong> {res.thumbnail_prompt}
          </div>
        </div>
      )}

      <button onClick={fetchSaved} className="btn-secondary px-4 py-2 bg-gray-300 rounded">
        Refresh Saved
      </button>

      {saved.length > 0 && (
        <div>
          <h2>Saved Results</h2>
          {saved.map((item) => (
            <details key={item.id} className="border bg-white p-2 mb-2">
              <summary>
                {item.query} — {new Date(item.created_at).toLocaleString()}
              </summary>
              <div>
                <strong>Tone:</strong> {item.tone}
              </div>
              <div>
                <strong>Keywords:</strong> {item.keywords.join(", ")}
              </div>
              <div>
                <strong>Tags:</strong> {item.tags.join(", ")}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

