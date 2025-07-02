import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/app/utils/supabase/server';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing file or title' }, { status: 400 });
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error: tokenError } = await supabase
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (tokenError || !data) {
    return NextResponse.json({ error: 'No tokens found' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );

  oauth2Client.setCredentials({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expiry_date,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private', // Or 'public' or 'unlisted'
        },
      },
      media: {
        body: Readable.from(fileBuffer),
      },
    });

    return NextResponse.json({ success: true, videoId: res.data.id }, { status: 200 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
