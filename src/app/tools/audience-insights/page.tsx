'use client';

import { useState } from 'react';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';

export default function AudienceInsightsPage() {
  const [region, setRegion] = useState('');
  const [demographics, setDemographics] = useState('');
  const [interests, setInterests] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audience-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comments, region, demographics, interests })
      });

      const data = await res.json();
      setResult(data.trends);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Audience Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <Input
            type="text"
            placeholder="e.g. United States"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Viewer Demographics</label>
          <Input
            type="text"
            placeholder="e.g. Age 18-34, Male"
            value={demographics}
            onChange={(e) => setDemographics(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Audience Interests</label>
          <Input
            type="text"
            placeholder="e.g. Tech Reviews, Gaming"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">YouTube Comments</label>
          <Textarea
            rows={6}
            placeholder="Paste multiple comments here..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          className={`w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold`}
          disabled={loading}>
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </motion.button>
      </div>

      {result?.output && (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 bg-slate-800 rounded-2xl shadow-md p-6"
          >
          <h2 className="text-xl font-semibold mb-4">Insights</h2>
          <ReactMarkdown>
            {result.output.replace(/\\n/g, '\n')}
          </ReactMarkdown>
        </motion.div>
      )}
    </div>
  );
}
