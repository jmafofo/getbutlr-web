'use client';
import { useState } from 'react';
import { motion } from "framer-motion";

export default function ContentPerformance() {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const stripHTML = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, "");

const fetchComments = async (videoId: string, maxTotal = 200) => {
  const comments: string[] = [];
  let nextPageToken = '';
  let count = 0;

  try {
    while (count < maxTotal) {
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${nextPageToken}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.items) break;

      const newComments = data.items.map(
        (item: any) => item.snippet.topLevelComment.snippet.textDisplay
      );

      comments.push(...newComments);
      count += newComments.length;

      if (!data.nextPageToken) break;
      nextPageToken = data.nextPageToken;
    }
  } catch (err) {
    console.error('Error fetching comments:', err);
  }

  return comments;
};

const handleCommentAnalyze = async () => {
  setError('');
  setResults(null);

  const videoId = url.split("v=")[1]?.split("&")[0];
  if (!videoId) {
    setError('Invalid YouTube URL');
    return;
  }

  try {
    // Step 1: Fetch video statistics
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`);
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      setError('Video not found or invalid API key');
      return;
    }

    const stats = data.items[0].statistics;

    // Step 2: Fetch and sanitize comments
    const rawComments = await fetchComments(videoId, 200);
    if (rawComments.length === 0) {
      setError('No comments found for this video.');
      return;
    }

    const cleanComments = rawComments.map(stripHTML);

    console.log(cleanComments);
    // Step 3: Analyze comments
    const insightRes = await fetch('/api/comment-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: cleanComments }),
    });

    const insightData = await insightRes.json();
    console.log(insightData);
    if (!insightData || !insightData.rawOutput) {
      setError('Failed to analyze comments.');
      return;
    }

    // Step 4: Set results
    setResults({
      viewCount: stats.viewCount,
      impressions: 'N/A',
      ctr: 'N/A',
      avgViewDuration: 'N/A',
      retentionData: [100, 90, 80, 60, 50, 30],
      tips: [
        'Use timestamps and structured segments.',
        'Improve thumbnail and title clarity.',
        'Hook your audience in the first 15 seconds.',
        ...(insightData.tips || []),
      ],
      insights: insightData.rawOutput,
    });
  } catch (err) {
    console.error(err);
    setError('Error fetching data or analyzing comments.');
  }
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="col-6-m space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Comment Insight Tool</h1>
          <p className="mb-4">Enter a YouTube URL to extract sentiment and viewer engagement insights.</p>

          <div className="flex flex-col-1 sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=xyz123"
              className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCommentAnalyze}
              className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
            >
              Analyze
            </motion.button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {results && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Performance Metrics</h2>
                <ul className="list-disc pl-6 text-white">
                  <li>View Count: {results.viewCount}</li>
                  <li>Impressions: {results.impressions}</li>
                  <li>CTR: {results.ctr}</li>
                  <li>Average View Duration: {results.avgViewDuration}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Retention Curve (Simulated)</h2>
                <div className="bg-gray-200 h-32 rounded-lg flex items-end gap-1 p-1">
                  {results.retentionData.map((val: number, i: number) => (
                    <div
                      key={i}
                      className="bg-blue-500 rounded-sm"
                      style={{ height: `${val}%`, width: '14%' }}
                      title={`Minute ${i + 1}: ${val}%`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Improvement Tips</h2>
                <ul className="list-disc pl-6 text-white">
                  {results.tips.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Comment Insights (LLM)</h2>
                <pre className="bg-slate-700 text-white p-4 rounded max-h-64 overflow-y-scroll whitespace-pre-wrap">
                  {results.insights}
                </pre>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
