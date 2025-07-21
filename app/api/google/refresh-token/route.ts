import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (!sessionData?.session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = sessionData.session.user.id;

  const { data: tokenData, error: tokenError } = await supabase
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ error: 'No token found' }, { status: 404 });
  }

  const { access_token, refresh_token, expiry_date } = tokenData;

  const now = Date.now();

  // If token is still valid, return it
  if (expiry_date && now < expiry_date - 60_000) {
    return NextResponse.json({ access_token, expiry_date, refreshed: false });
  }

  // Refresh token using Google's OAuth client
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );

  oauth2Client.setCredentials({
    refresh_token,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update Supabase with new token
    const { error: updateError } = await supabase
      .from('google_tokens')
      .update({
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date,
        scope: credentials.scope,
        token_type: credentials.token_type,
      })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date,
      refreshed: true,
    });
  } catch (err: any) {
    console.error('Token refresh error:', err);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}
