import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  const { userId, youtube_channel_id, youtube_channel_name } = await req.json();

  if (!userId || !youtube_channel_id || !youtube_channel_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error: creatorError } = await supabase
    .from('creator_profiles')
    .upsert({
      user_id: userId,
      youtube_channel_id,
      youtube_channel_name,
      completed_survey: false,
    }, { onConflict: 'user_id' }); // Upsert to prevent duplicates

  if (creatorError) {
    return NextResponse.json(
      { error: `Failed to save creator profile: ${creatorError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
