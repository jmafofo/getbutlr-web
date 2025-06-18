import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { videoId, CTR, watchTime, userId } = await req.json();
  const { error } = await sb.from('performance_logs').insert({
    user_id: userId,
    video_id: videoId,
    ctr: CTR,
    watch_time: watchTime,
  });

  return error ? NextResponse.json({ ok: false, error }) : NextResponse.json({ ok: true });
}

