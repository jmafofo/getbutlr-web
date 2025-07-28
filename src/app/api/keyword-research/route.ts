import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API;

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&order=viewCount&type=video&maxResults=25&key=${API_KEY}`);
  const searchData = await searchRes.json();

  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
  const videoDetailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`);
  const videoDetails = await videoDetailsRes.json();

  const allText = videoDetails.items.map((v: any) => `${v.snippet.title} ${v.snippet.description}`).join(" ").toLowerCase();
  const words = allText.match(/\b\w{4,}\b/g) || [];
  const freq: { [key: string]: number } = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const keywords = sorted.map(([keyword, count]) => ({
    keyword,
    volume: 10000 + count * 150,
    difficulty: Math.min(100, 30 + count * 2)
  }));

  return NextResponse.json({ keywords });
}