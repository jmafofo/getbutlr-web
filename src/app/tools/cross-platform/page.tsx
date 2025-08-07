'use client';
import { useState } from 'react';

export default function CrossPlatformConverter() {
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [convertedText, setConvertedText] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/cross-platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputText, platform }),
    });
    const data = await res.json();
    setConvertedText(data.convertedText);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cross-Platform Format Converter</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={6}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your YouTube script or description..."
      />
      <select
        className="p-2 border rounded mb-4 w-full"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="twitter">Twitter/X</option>
        <option value="facebook">Facebook</option>
      </select>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Convert
      </button>
      {convertedText && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Formatted Output:</h2>
          <pre className="whitespace-pre-wrap">{convertedText}</pre>
        </div>
      )}
    </div>
  );
}
