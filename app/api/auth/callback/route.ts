import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body.code;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI! // Should match exactly the redirect set in Google Console
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Tokens received:', tokens);

    // ✅ Save tokens to your database here (e.g., Supabase, MongoDB, etc.)

    return NextResponse.json({
      success: true,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });
  } catch (error: any) {
    console.error('OAuth Error:', error);
    return NextResponse.json(
      { error: error.message || 'OAuth failed' },
      { status: 500 }
    );
  }
}
