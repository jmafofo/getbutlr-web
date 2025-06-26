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
    .select('youtube_channel_id')
    .eq('user_id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const CHANNEL_ID = data.youtube_channel_id;

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();

    const channel = channelData.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const snippet = channel.snippet;

    return NextResponse.json({
      id: channel.id,
      title: snippet?.title || '',
      description: snippet?.description || '',
      publishedAt: snippet?.publishedAt || '',
      country: snippet?.country || '',
      thumbnails: snippet?.thumbnails || {},
    });
  } catch (error) {
    console.error('Error fetching YouTube channel snippet:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube channel snippet' }, { status: 500 });
  }
}
