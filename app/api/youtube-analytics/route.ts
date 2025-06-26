import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(req: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API;
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (!sessionData.session || sessionError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const CHANNEL_ID = data.youtube_channel_id;
  console.log('CHANNEL_ID:', CHANNEL_ID);

  try {
    // --- Fetch channel stats ---
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();

    const stats = channelData.items?.[0]?.statistics;
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return NextResponse.json({ error: 'No uploads playlist found' }, { status: 404 });
    }

    // --- Fetch videos from uploads playlist ---
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${API_KEY}`
    );
    const playlistData = await playlistRes.json();

    const videoIds = playlistData.items?.map(
      (item: any) => item.contentDetails?.videoId
    );

    if (!videoIds || videoIds.length === 0) {
      return NextResponse.json({ error: 'No videos found' }, { status: 404 });
    }

    // --- Fetch video stats ---
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(
        ','
      )}&key=${API_KEY}`
    );
    const videosData = await videosRes.json();

    const videos = videosData.items?.map((video: any) => ({
      title: video.snippet?.title,
      viewCount: parseInt(video.statistics?.viewCount || '0', 10),
    }));

    // --- Sort by viewCount descending ---
    const topVideos = videos
      ?.sort((a: any, b: any) => b.viewCount - a.viewCount)
      .slice(0, 3);

    return NextResponse.json({
      subscribers: stats?.subscriberCount || 0,
      views: stats?.viewCount || 0,
      videos: stats?.videoCount || 0,
      topVideos: topVideos || [],
    });
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}
