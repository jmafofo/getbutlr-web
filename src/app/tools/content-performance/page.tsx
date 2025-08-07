'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';

export default function ContentPerformance() {
  const [url, setUrl] = useState('');
  const [youtubeData, setYoutubeData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API;

  const handleAnalyze = async () => {
    setError('');
    setYoutubeData(null);
    setAnalysis(null);

    const videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    setLoading(true);
    try {
      // Fetch video data from YouTube API with snippet and statistics
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`);
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        setError('Video not found or invalid API key');
        setLoading(false);
        return;
      }

      const video = data.items[0];
      const { title, description, tags = [] } = video.snippet;
      const stats = video.statistics;

      // Save YouTube data locally for UI display
      setYoutubeData({
        title,
        description,
        tags,
        viewCount: stats.viewCount,
        likeCount: stats.likeCount,
        commentCount: stats.commentCount,
      });

      // Post video data to your API route for analysis
      const analysisRes = await fetch('/api/content-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags }),
      });

      if (!analysisRes.ok) {
        setError('Error fetching analysis from API');
        setLoading(false);
        return;
      }

      const analysisData = await analysisRes.json();
      setAnalysis(analysisData.trends?.output || analysisData);

    } catch (err) {
      setError('Error fetching data from YouTube or analysis API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="col-6-m space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Content Performance Analyzer</h1>
          <p className="mb-4">Enter a YouTube video URL to analyze performance metrics.</p>

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
              onClick={handleAnalyze}
              className="w-50 p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </motion.button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {youtubeData && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">YouTube Video Data</h2>
              <ul className="list-disc pl-6 text-white-700">
                <li><strong>Title:</strong> {youtubeData.title}</li>
                <li><strong>Description:</strong> {youtubeData.description || 'N/A'}</li>
                <li><strong>Tags:</strong> {youtubeData.tags.length > 0 ? youtubeData.tags.join(', ') : 'None'}</li>
                <li><strong>View Count:</strong> {youtubeData.viewCount}</li>
                <li><strong>Likes:</strong> {youtubeData.likeCount || 'N/A'}</li>
                <li><strong>Comments:</strong> {youtubeData.commentCount || 'N/A'}</li>
              </ul>
            </div>
          )}

          {analysis && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Performance Analysis</h2>
              {/* Render markdown output */}
              <div className="prose max-w-none text-white bg-gray-900 p-4 rounded-md">
                <ReactMarkdown>{typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
