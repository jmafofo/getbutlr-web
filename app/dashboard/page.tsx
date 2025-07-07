'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import ChartCard from '@/components/ChartCard';
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type VideoData = {
  title: string;
  viewCount: number;
};

type YoutubeData = {
  views: number;
  subscribers: number;
  videos: number;
  realtimeViews: number;
  last7DaysViews: number[];
  topVideos: VideoData[];
  contentTypePerformance: {
    shorts: number;
    videos: number;
    live: number;
  };
};

const initialYoutubeData: YoutubeData = {
  views: 0,
  subscribers: 0,
  videos: 0,
  realtimeViews: 0,
  last7DaysViews: [120, 150, 90, 180, 220, 160, 200],
  topVideos: [
    {
      title: "",
      viewCount: 0,
    },
  ],
  contentTypePerformance: {
    shorts: 0,
    videos: 0,
    live: 0,
  },
};

export default function DashboardPage() {
  const [youtubeData, setYoutubeData] = useState<YoutubeData>(initialYoutubeData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginDays, setLoginDays] = useState<number | null>(null);


  useEffect(() => {
    const fetchLoginDays = async () => {
      try {
        const res = await fetch('/api/auth/logindays');
        if (!res.ok) throw new Error('Failed to fetch login days');
        const data = await res.json();
        setLoginDays(data.loginDays);
        // console.log('Login Days:', data.loginDays);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchLoginDays();
  }, []);
  

  useEffect(() => {
    const fetchYoutubeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/youtube/analytics');
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setYoutubeData(prev => ({
          ...prev,
          ...data,
        }));
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchYoutubeData();
  }, []);

  if (loading) {
    return <div className="p-5 text-white">Loading YouTube analytics...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl p-5 text-white bg-gradient-to-r from-pink-600 to-purple-600 shadow-md">
        <div className="flex items-start gap-3">
          <div className="text-yellow-300 text-2xl">💡</div>
          <div>
            <p className="text-lg font-semibold">Looking for content inspiration?</p>
            <p className="text-yellow-300 font-bold">Try the Smart Idea Generator</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 text-white bg-red-600 shadow-md flex items-center gap-4">
        <div className="text-white text-3xl">👤</div>
        <div>
          <p className="text-md">
            Your channel reached <strong>{Number(youtubeData.subscribers).toLocaleString()} subscribers</strong> with
          </p>
          <p className="text-yellow-300 font-bold">Thumbnail Coach</p>
        </div>
      </div>

      <div className="rounded-2xl p-5 text-white bg-sky-600 shadow-md flex items-start gap-3">
        <div className="text-yellow-300 text-2xl">🚀</div>
        <div>
          <p className="text-lg font-semibold">You've used GetButlr tools</p>
          <p className="text-white">{loginDays} days in a row!</p>
        </div>
      </div>
    </div>

      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* ✅ OVERVIEW TAB */}
        <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <MetricCard title="Views (28 days)" value={Number(youtubeData.views).toLocaleString()} />
          <MetricCard title="Subscribers" value={Number(youtubeData.subscribers).toLocaleString()} />
          <MetricCard title="Videos Published" value={Number(youtubeData.videos).toLocaleString()} />
          <MetricCard title="Realtime Views" value={Number(youtubeData.realtimeViews).toLocaleString()} />
        </div>

          <div className="bg-slate-800 rounded-2xl shadow-md p-4">
            <ChartCard
              title="Last 7 Days Views"
              labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              dataValues={youtubeData.last7DaysViews}
            />
          </div>
        </TabsContent>

        {/* ✅ CONTENT TAB */}
        <TabsContent value="content">
          <div className="grid grid-cols-1 gap-6 bg-slate-800 rounded-2xl shadow-md p-4 mb-5">
            <ChartCard
              title="Top Performing Videos"
              labels={youtubeData.topVideos?.map((video) => video.title) ?? []}
              dataValues={youtubeData.topVideos?.map((video) => video.viewCount) ?? []}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 bg-slate-800 rounded-2xl shadow-md p-4">
            <ChartCard
              title="Content Type Performance"
              labels={['Shorts', 'Videos', 'Live']}
              dataValues={[
                youtubeData.contentTypePerformance.shorts,
                youtubeData.contentTypePerformance.videos,
                youtubeData.contentTypePerformance.live,
              ]}
            />
          </div>
        </TabsContent>

        {/* ✅ AUDIENCE TAB */}
        <TabsContent value="audience">
          <div className="grid grid-cols-1 gap-6 bg-slate-800 rounded-2xl shadow-md p-4 mb-5">
            <ChartCard
              title="Returning vs New Viewers"
              labels={['New', 'Returning']}
              dataValues={[2500, 800]}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 bg-slate-800 rounded-2xl shadow-md p-4">
            <ChartCard
              title="Top Geographies"
              labels={['US', 'PH', 'IN']}
              dataValues={[1000, 800, 500]}
            />
          </div>
        </TabsContent>

        {/* ✅ TRENDS TAB */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 gap-6 bg-slate-800 rounded-2xl shadow-md p-4 mb-5">
            <ChartCard
              title="Traffic Sources"
              labels={['Search', 'Suggested', 'External']}
              dataValues={[1200, 900, 400]}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 bg-slate-800 rounded-2xl shadow-md p-4">
            <ChartCard
              title="Device Types"
              labels={['Mobile', 'Desktop', 'Tablet']}
              dataValues={[1600, 1000, 300]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-md p-4 flex flex-col justify-between">
      <h2 className="text-lg text-slate-300">{title}</h2>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}
