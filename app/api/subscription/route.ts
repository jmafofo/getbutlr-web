import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: userError?.message || 'User not found' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: userError?.message || 'User not found' }, { status: 401 });
  }

  const { tier, trial, plan, status } = await req.json();

  const values: any = {
    user_id: user.id,
    tier,
    plan,
    status
  };

  if (trial) {
    const start = new Date();
    const exp = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
    values.trial_started = start;
    values.trial_expires = exp;
    values.status = status
  }

  const { data: newSub, error } = await supabase
    .from('subscriptions')
    .upsert(values, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newSub);
}
