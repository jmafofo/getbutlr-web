import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const code = body.code;
//   const userId = body.userId;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const userId = sessionData.session.user.id;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
        throw new Error('Failed to retrieve access token');
    }
  
    oauth2Client.setCredentials(tokens);

    const { error } = await supabase
    .from('google_tokens')
    .upsert(
        {
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        scope: tokens.scope,
        token_type: tokens.token_type,
        },
        { onConflict: 'user_id' }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, tokens }, { status: 200 });
  } catch (error: any) {
    console.error('OAuth Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
