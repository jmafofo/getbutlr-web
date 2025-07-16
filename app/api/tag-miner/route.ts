import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API;

function getPublishedAfter(range: string): string {
  const now = new Date();
  const daysAgo = range === '7' ? 7 : range === '30' ? 30 : 90;
  const date = new Date(now.getTime() - daysAgo * 86400000);
  return date.toISOString();
}

export async function POST(req: NextRequest) {
  const { topic, platform, dateRange } = await req.json();

  if (platform === 'TikTok' || platform === 'Instagram') {
    const tags = [
      { name: '#viralChallenge', percent: 91, viralityScore: 88000 },
      { name: '#trendingNow', percent: 84, viralityScore: 72000 },
      { name: '#reels2025', percent: 75, viralityScore: 68000 },
    ];
    return NextResponse.json({ tags });
  }

  const publishedAfter = getPublishedAfter(dateRange);
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&order=viewCount&type=video&maxResults=25&publishedAfter=${publishedAfter}&key=${API_KEY}`);
  const data = await res.json();
  const ids = data.items.map((item: any) => item.id.videoId).join(',');

  const videoDataRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${API_KEY}`);
  const videoData = await videoDataRes.json();

  const tagMap: { [tag: string]: { count: number, score: number } } = {};

  videoData.items.forEach((v: any) => {
    const tags = v.snippet.tags || [];
    const stats = v.statistics;
    const virality = (parseInt(stats.viewCount || '0') + parseInt(stats.likeCount || '0') + parseInt(stats.commentCount || '0'));
    tags.forEach((tag: string) => {
      if (!tagMap[tag]) tagMap[tag] = { count: 0, score: 0 };
      tagMap[tag].count++;
      tagMap[tag].score += virality;
    });
  });

  const totalVideos = videoData.items.length;
  const tags = Object.entries(tagMap).map(([name, val]) => ({
    name,
    percent: Math.round((val.count / totalVideos) * 100),
    viralityScore: Math.round(val.score / val.count)
  })).sort((a, b) => b.percent - a.percent).slice(0, 20);

  return NextResponse.json({ tags });
}