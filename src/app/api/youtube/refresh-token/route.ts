import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/src/app/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 1. Get stored token from Supabase
    const { data: tokenData, error } = await supabase
      .from('google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !tokenData) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    const { access_token, refresh_token, expiry_date } = tokenData;

    const now = Date.now();

    // 2. Check if token is expired
    if (expiry_date && now < expiry_date - 60_000) {
      // Not expired (1 minute buffer)
      return NextResponse.json({ access_token, refreshed: false });
    }

    if (!refresh_token) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 400 });
    }

    // 3. Refresh the token using googleapis
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({ refresh_token });

    let credentials;
    try {
      ({ credentials } = await oauth2Client.refreshAccessToken());
    } catch (err: any) {
      console.error('[RefreshTokenError]', err?.response?.data || err);

      // 🔥 Delete invalid refresh token from Supabase
      await supabase
        .from('google_tokens')
        .delete()
        .eq('user_id', userId);

      return NextResponse.json({
        error: 'Refresh token invalid or expired. User must re-authorize.',
        code: 'invalid_grant',
      }, { status: 401 });
    }

    const newAccessToken = credentials.access_token;
    const newExpiryDate = credentials.expiry_date;

    if (!newAccessToken || !newExpiryDate) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
    }

    // 4. Save updated token to Supabase
    await supabase
      .from('google_tokens')
      .update({
        access_token: newAccessToken,
        expiry_date: newExpiryDate,
      })
      .eq('user_id', userId);

    return NextResponse.json({
      access_token: newAccessToken,
      refreshed: true,
    });
  } catch (err) {
    console.error('[RefreshTokenError]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
