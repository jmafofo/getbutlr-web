'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ContentPerformance() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stripHTML = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, '');

  const fetchComments = async (videoId: string, maxTotal = 200) => {
    const comments: string[] = [];
    let nextPageToken = '';
    let count = 0;

    try {
      while (count < maxTotal) {
        const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${nextPageToken}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`;
        const res = await fetch(apiUrl);
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
    setLoading(true);

    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    try {
      // 1. Fetch video statistics
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`
      );
      const statsData = await statsRes.json();
      if (!statsData.items || statsData.items.length === 0) {
        setError('Video not found or invalid API key');
        return;
      }

      const stats = statsData.items[0].statistics;

      // 2. Fetch & clean comments
      const rawComments = await fetchComments(videoId, 200);
      if (rawComments.length === 0) {
        setError('No comments found for this video.');
        return;
      }
      const cleanComments = rawComments.map(stripHTML);

      // 3. Send to /api/comment-insights
      const insightRes = await fetch('/api/comment-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: cleanComments }),
      });

      const insightData = await insightRes.json();

      if (!insightData.output) {
        setError('LLM response was invalid.');
        return;
      }

      // 4. Set results from real API + AI
      setResults({
        viewCount: stats.viewCount,
        likeCount: stats.likeCount,
        commentCount: stats.commentCount,
        tips: insightData.tips || [],
        insights: insightData.output,
      });
    } catch (err) {
      console.error(err);
      setError('Error fetching data or analyzing comments.');
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="col-span-2 space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">YouTube Comment Insight Tool</h1>
          <p className="mb-4">Enter a YouTube video URL to analyze audience sentiment and suggestions.</p>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
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
              disabled={loading}
              className="w-full sm:w-auto p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </motion.button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {results && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Performance Metrics</h2>
                <ul className="list-disc pl-6 text-white">
                  <li>View Count: {results.viewCount}</li>
                  <li>Likes: {results.likeCount}</li>
                  <li>Comments: {results.commentCount}</li>
                </ul>
              </div>

              {results.tips.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">Improvement Tips</h2>
                  <ul className="list-disc pl-6 text-white">
                    {results.tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold">Comment Insights (AI)</h2>
                <div className="prose prose-invert max-w-none bg-slate-700 text-white p-4 rounded max-h-[400px] overflow-y-auto">
                  <ReactMarkdown>{results.insights}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
