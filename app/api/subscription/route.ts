import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(req: NextRequest) {
  const user = sb.auth.admin.getUser?.();
  const { data, error } = await sb.from('user_subscriptions').select('*').eq('user_id', user?.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { user_id, tier, trial } = await req.json();
  // Create or update subscription record
  const values: any = { user_id, tier };
  if (trial) {
    const start = new Date(), exp = new Date(start.getTime() + 14*24*60*60*1000);
    values.trial_started = start; values.trial_expires = exp;
  }
  const { error } = await sb.from('user_subscriptions').upsert(values);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

