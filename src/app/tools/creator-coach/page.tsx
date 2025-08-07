'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/src/app/utils/supabase/client';
import ReactMarkdown from 'react-markdown';

export default function CreatorCoachPage() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession();
        if (error) throw error;
        if (session?.user?.id) {
          setUserId(session.user.id);
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
      }
    };

    fetchUser();
  }, []);

  const generateReport = async () => {
    if (!userId) {
      console.warn('User ID not available yet.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/creator-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setReport(data?.parsedResult?.output || 'No report generated.');
    } catch (err) {
      console.error('Error generating report:', err);
      setReport('There was an error generating your report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">🧠</div>
        <h1 className="text-2xl font-bold">Creator AI Coach</h1>
        <p className="text-gray-600 mt-2">
          Get personalized weekly feedback on your latest video performance.
        </p>
      </div>

      {/* Generate Report Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <button
          onClick={generateReport}
          disabled={loading || !userId}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md transition ${
            loading || !userId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Get My Coaching Report'}
        </button>
      </div>

      {/* Report Output */}
      {report && (
        <div className="bg-slate-800 text-white shadow rounded-lg p-6 whitespace-pre-wrap space-y-4">
          <h3 className="text-lg font-semibold mb-4">📋 AI Coaching Summary</h3>
          <ReactMarkdown>
            {report}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
