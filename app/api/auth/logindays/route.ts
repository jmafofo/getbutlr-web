import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (!sessionData.session || sessionError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = sessionData.session.user.id;

  const { data: userMeta, error: userError } = await supabase
    .from('users') // This should be your mirrored `auth.users` table
    .select('confirmed_at, last_sign_in_at')
    .eq('id', userId)
    .single();

  if (userError || !userMeta) {
    return NextResponse.json(
      { error: 'User metadata not found or error querying user' },
      { status: 404 }
    );
  }

  const confirmedAt = new Date(userMeta.confirmed_at);
  const lastSignInAt = new Date(userMeta.last_sign_in_at);
  const loginDays = Math.floor(
    (lastSignInAt.getTime() - confirmedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return NextResponse.json({ loginDays });
}
