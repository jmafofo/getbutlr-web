import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API!;
const SERP_API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    const channelId = extractChannelId(url);

    if (!videoId && !channelId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Fetch from YouTube
    const ytData = videoId
      ? await fetchVideoStats(videoId)
      : await fetchChannelStats(channelId);

    // Fetch niche data via SerpAPI
    const nicheData = await fetchNicheData(ytData.title || ytData.description || 'youtube content');
    console.log(nicheData);
    // Score calculation
    const scores = calculateScores(ytData);

    return NextResponse.json({ scores, niche: nicheData });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// ---------------------
// Utility Functions
// ---------------------

function extractVideoId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function extractChannelId(url: string) {
  const match = url.match(/(?:channel\/|user\/|c\/|@)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

async function fetchVideoStats(videoId: string) {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const video = res.data.items?.[0];
  if (!video) throw new Error('Video not found');

  return {
    title: video.snippet.title,
    description: video.snippet.description,
    viewCount: Number(video.statistics.viewCount),
    likeCount: Number(video.statistics.likeCount),
    commentCount: Number(video.statistics.commentCount),
  };
}

async function fetchChannelStats(channelId: string) {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
  );
  const channel = res.data.items?.[0];
  if (!channel) throw new Error('Channel not found');

  return {
    title: channel.snippet.title,
    description: channel.snippet.description,
    subscriberCount: Number(channel.statistics.subscriberCount),
    videoCount: Number(channel.statistics.videoCount),
    viewCount: Number(channel.statistics.viewCount),
  };
}

async function fetchNicheData(query: string) {
  const res = await axios.get(
    `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`
  );
  return res.data.organic_results?.slice(0, 5) || [];
}

function calculateScores(data: any) {
  const baseScores = [];

  if ('viewCount' in data) {
    baseScores.push({
      label: 'Views',
      value: data.viewCount,
      median: 10000,
      verdict: data.viewCount > 10000 ? 'Above Avg' : 'Below Avg',
    });
  }

  if ('likeCount' in data) {
    baseScores.push({
      label: 'Likes',
      value: data.likeCount,
      median: 500,
      verdict: data.likeCount > 500 ? 'Good' : 'Low',
    });
  }

  if ('commentCount' in data) {
    baseScores.push({
      label: 'Comments',
      value: data.commentCount,
      median: 100,
      verdict: data.commentCount > 100 ? 'Engaged' : 'Needs Work',
    });
  }

  if ('subscriberCount' in data) {
    baseScores.push({
      label: 'Subscribers',
      value: data.subscriberCount,
      median: 10000,
      verdict: data.subscriberCount > 10000 ? 'Growing' : 'Small Channel',
    });
  }

  return baseScores;
}
