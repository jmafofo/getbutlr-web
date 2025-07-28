import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { testId, variant, impressionDelta, clickDelta, watchTimeDelta } = await req.json();

  const fieldMapping = {
    impressions: variant === 'A' ? 'impressions_a' : 'impressions_b',
    clicks: variant === 'A' ? 'clicks_a' : 'clicks_b',
    watch_time: variant === 'A' ? 'watch_time_a' : 'watch_time_b',
  };

  const updates: any = {};
  if (impressionDelta) updates[fieldMapping['impressions']] = { increment: impressionDelta };
  if (clickDelta) updates[fieldMapping['clicks']] = { increment: clickDelta };
  if (watchTimeDelta) updates[fieldMapping['watch_time']] = { increment: watchTimeDelta };

  await supabase
    .from('ab_tests')
    .update(updates)
    .eq('id', testId);

  return NextResponse.json({ ok: true });
}

