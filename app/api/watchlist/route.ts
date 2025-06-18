import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const { user_id, keyword } = await req.json();
  const { data, error } = await supabase
    .from('watchlists')
    .upsert({ user_id, keyword }, { onConflict: ['user_id', 'keyword'] })
    .select();
  if (error) return NextResponse.error();
  return NextResponse.json({ watch: data?.[0] });
}

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get('user_id');
  const { data, error } = await supabase.from('watchlists').select('*').eq('user_id', user_id);
  if (error) return NextResponse.error();
  return NextResponse.json({ watches: data });
}

