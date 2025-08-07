import { NextRequest, NextResponse } from 'next/server';
import { google, youtube_v3 } from 'googleapis';
import { callOllama } from '../ollama_query/route';
import { createClient } from '@/src/app/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  try {
    const { userId } = await req.json();

    const { data: cp_data, error: cp_Error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

    if (cp_Error || !cp_data) {
      return NextResponse.json({ error: 'No Profile found' }, { status: 404 });
    }

    const { data: tokenData, error: tokenError } = await supabase
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'No token found' }, { status: 404 });
    }

    const { access_token } = tokenData;

    if (!userId) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });

    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({ access_token });

    const youtube: youtube_v3.Youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    const channelsRes = await youtube.channels.list({
      part: ['contentDetails'],
      mine: true,
    });
    

    const uploadsPlaylistId =
      channelsRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return NextResponse.json({ error: 'Uploads playlist not found' }, { status: 404 });
    }

    const playlistItemsRes = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 25,
    });

    const videoIds = playlistItemsRes.data.items
      ?.map((item) => item.contentDetails?.videoId)
      .filter(Boolean) as string[];

    if (!videoIds?.length) {
      return NextResponse.json({ error: 'No videos found in playlist' }, { status: 404 });
    }

    const videosRes = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: videoIds,
    });
    
    const videos = videosRes.data.items?.map((video) => ({
      id: video.id,
      title: video.snippet?.title,
      description: video.snippet?.description,
      views: video.statistics?.viewCount,
      likes: video.statistics?.likeCount,
      comments: video.statistics?.commentCount,
    })) || [];

    const prompt = `You are a YouTube coach. Analyze the performance of the following videos and provide:
      - Strengths
      - Weaknesses
      - Key advice
      - Suggested Creator Academy modules
      - Motivation message

      Videos:
      ${JSON.stringify(videos, null, 2)}
      `;

    const rawResult = await callOllama(prompt);

    let parsedResult;
    try {
      const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
      parsedResult = JSON.parse(cleaned);
    } catch {
      parsedResult = { output: rawResult };
    }

    // await supabase.from('creator_reports').insert({
    //   user_id: userId,
    //   youtube_channel_id: channel,
    //   parsedResult
    // });

    return NextResponse.json({ parsedResult });
  } catch (err) {
    console.error('[CreatorCoachError]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
