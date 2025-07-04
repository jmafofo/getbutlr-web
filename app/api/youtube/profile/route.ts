import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(req: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API;
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', data: null },
      { status: 401 }
    );
  }

  const userId = sessionData.session.user.id;

  // ✅ Fetch creator profile
  const { data: profile, error: profileError } = await supabase
    .from('creator_profiles')
    .select('youtube_channel_id')
    .eq('user_id', userId)
    .single();

  if (profileError || !profile?.youtube_channel_id) {
    return NextResponse.json(
      { success: false, error: 'Profile not found or no YouTube channel linked.', data: null },
      { status: 404 }
    );
  }

  const CHANNEL_ID = profile.youtube_channel_id;

  try {
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
    );

    if (!ytRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch YouTube data', data: null },
        { status: ytRes.status }
      );
    }

    const ytData = await ytRes.json();
    const channel = ytData.items?.[0];

    if (!channel) {
      return NextResponse.json(
        { success: false, error: 'YouTube channel not found', data: null },
        { status: 404 }
      );
    }

    const snippet = channel.snippet;

    return NextResponse.json(
      {
        success: true,
        error: null,
        data: {
          id: channel.id,
          title: snippet?.title || '',
          description: snippet?.description || '',
          publishedAt: snippet?.publishedAt || '',
          country: snippet?.country || '',
          thumbnails: snippet?.thumbnails || {},
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('YouTube fetch error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error while fetching YouTube channel.',
        data: null,
      },
      { status: 500 }
    );
  }
}
