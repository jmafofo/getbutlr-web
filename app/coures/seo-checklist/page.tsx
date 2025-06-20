'use client';

import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function SEOChecklistPage() {
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setOutput('');

    setTimeout(() => {
      setOutput(
        `🔍 SEO Optimization for: "${videoTitle}"\n\n` +
        `- 📌 Keywords: travel vlog, Fujairah coast, beach adventure, 2024 trip\n` +
        `- 🏷️ Hashtags: #TravelVlog #Fujairah #CoastalJourney #BeachLife\n` +
        `- 📅 Best Publish Time: Saturday 11AM – 1PM\n` +
        `- 📣 CTA: "Subscribe for more epic coastlines & hidden gems!"\n` +
        `- 🧠 Alternate Titles:\n   - "Exploring the Untouched Fujairah Coast"\n   - "I Found a Secret Beach in the UAE"\n   - "This Beach Will Blow Your Mind — Fujairah Adventures!"`
      );
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    const element = document.createElement('div');
    element.innerText = output;
    html2pdf().from(element).save(`${videoTitle || 'SEO_Checklist'}.pdf`);
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📄 Upload Optimization Coach</h1>
      <p className="mb-4">Get a checklist to optimize your video’s metadata before uploading.</p>

      <input
        type="text"
        className="w-full p-3 border rounded mb-4"
        placeholder="Video Title (e.g. Discovering the Fujairah Coast)"
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)}
      />

      <textarea
        rows={4}
        className="w-full p-3 border rounded mb-4"
        placeholder="Short video description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading || !videoTitle.trim() || !description.trim()}
      >
        {loading ? 'Generating...' : 'Get SEO Checklist'}
      </button>

      {output && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Butlr SEO Checklist</h2>
          <pre className="whitespace-pre-wrap text-sm mb-4">{output}</pre>
          <div className="flex gap-4">
            <button
              onClick={handleCopy}
              className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded"
            >
              📋 Copy All
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
            >
              ⬇ Export PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

