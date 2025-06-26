'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import ChartCard from '@/components/ChartCard';

export default function DashboardPage() {
  const [youtubeData, setYoutubeData] = useState({
    views: 0,
    subscribers: 0,
    videos: 0,
    realtimeViews: 0,
    last7DaysViews: [120, 150, 90, 180, 220, 160, 200],
    topVideos: []
  });

  useEffect(() => {
    const fetchYoutubeData = async () => {
      const res = await fetch('/api/youtube-analytics');
      const data = await res.json();
      setYoutubeData(data);
    };

    fetchYoutubeData();
  }, []);

  return (
    <div className="p-5">
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
            <MetricCard title="Views (28 days)" value={youtubeData.views} />
            <MetricCard title="Subscribers" value={youtubeData.subscribers} />
            <MetricCard title="Videos Published" value={youtubeData.videos} />
            <MetricCard title="Realtime Views" value={youtubeData.realtimeViews} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard
              title="Top Performing Videos"
              labels={youtubeData.topVideos.map((video) => video.title)}
              dataValues={youtubeData.topVideos.map((video) => video.viewCount)}
            />
            <ChartCard
              title="Content Type Performance"
              labels={['Shorts', 'Videos', 'Live']}
              dataValues={[3000, 1500, 500]}
            />
          </div>
        </TabsContent>

        {/* ✅ AUDIENCE TAB */}
        <TabsContent value="audience">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard
              title="Returning vs New Viewers"
              labels={['New', 'Returning']}
              dataValues={[2500, 800]}
            />
            <ChartCard
              title="Top Geographies"
              labels={['US', 'PH', 'IN']}
              dataValues={[1000, 800, 500]}
            />
          </div>
        </TabsContent>

        {/* ✅ TRENDS TAB */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard
              title="Traffic Sources"
              labels={['Search', 'Suggested', 'External']}
              dataValues={[1200, 900, 400]}
            />
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
