'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ContentPerformance() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHookAnalyze = async () => {
    setError('');
    setResults(null);
    setLoading(true);

    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`
      );
      const data = await res.json();

      if (!res.ok || !data.items || data.items.length === 0) {
        setError('Video not found or invalid API key');
        return;
      }

      const item = data.items[0];
      const stats = item.statistics;
      const snippet = item.snippet;
      const durationISO = item.contentDetails.duration;

      const durationMatch = durationISO.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(durationMatch?.[1] || '0');
      const minutes = parseInt(durationMatch?.[2] || '0');
      const seconds = parseInt(durationMatch?.[3] || '0');

      const viewCount = parseInt(stats.viewCount || '0');
      const likeCount = parseInt(stats.likeCount || '0');
      const commentCount = parseInt(stats.commentCount || '0');
      const engagementRate = ((likeCount + commentCount) / viewCount) * 100;
      const thumbnailUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
      const hookRes = await fetch('/api/hook-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hookText: snippet.title }),
      });

      const hookData = await hookRes.json();
      if (!hookRes.ok) {
        setError('Hook analysis failed.');
        console.error(hookData);
        return;
      }

      setResults({
        thumbnail: thumbnailUrl,
        title: snippet.title,
        channel: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        duration: `${hours}h ${minutes}m ${seconds}s`,
        viewCount: viewCount.toLocaleString(),
        likeCount: likeCount.toLocaleString(),
        commentCount: commentCount.toLocaleString(),
        engagementRate: `${engagementRate.toFixed(2)}%`,
        impressions: 'N/A',
        ctr: 'N/A',
        avgViewDuration: 'N/A',
        retentionData: hookData.retentionCurve,
        tips: hookData.tips,
        analysis: hookData.analysis,
        improvedHooks: hookData.improvedHooks,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error analyzing video.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-white">Hook Analyzer</h1>
          <p className="mb-4 text-gray-300">Enter a YouTube video URL to analyze its hook and performance.</p>

          <div className="flex flex-col sm:flex-col gap-2 mb-4">
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
              onClick={handleHookAnalyze}
              disabled={loading}
              className="w-50 p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold mt-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </motion.button>
          </div>

          {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

          {results && (
            <div className="space-y-6 text-white">
              <div>
                <h2 className="text-xl font-semibold">Video Summary</h2>
                <ul className="list-disc pl-6 text-gray-300">
                  <li>Title: {results.title}</li>
                  <li>Channel: {results.channel}</li>
                  <li>Published At: {new Date(results.publishedAt).toLocaleDateString()}</li>
                  <li>Duration: {results.duration}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Performance Metrics</h2>
                <ul className="list-disc pl-6 text-gray-300">
                  <li>Views: {results.viewCount}</li>
                  <li>Likes: {results.likeCount}</li>
                  <li>Comments: {results.commentCount}</li>
                  <li>Engagement Rate: {results.engagementRate}</li>
                  <li>Impressions: {results.impressions}</li>
                  <li>CTR: {results.ctr}</li>
                  <li>Average View Duration: {results.avgViewDuration}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-white">Analytics</h1>

          {results && (
            <div className="space-y-6 text-white">
              <div>
                <h2 className="text-xl font-semibold">Video Thumbnail</h2>
                <div className="prose prose-invert max-w-none text-gray-300">
                  {results.thumbnail && (
                      <img src={results.thumbnail} alt={`Thumbnail of ${results.title}`} className="rounded-lg mb-4" />
                    )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Hook Feedback</h2>
                <div className="prose prose-invert max-w-none text-gray-300">
                  <ReactMarkdown>
                    {results.analysis}
                  </ReactMarkdown>
                </div>
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
                <ul className="list-disc pl-6 text-gray-300">
                  {results.tips.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Suggested Improved Hooks</h2>
                <ul className="list-disc pl-6 text-gray-300">
                  {results.improvedHooks.map((hook: string, i: number) => (
                    <li key={i}>{hook}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
