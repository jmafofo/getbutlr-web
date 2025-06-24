import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (!sessionData.session || sessionError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { quizAnswers, growthPlan } = await request.json();

  if (!quizAnswers || !growthPlan) {
    return NextResponse.json({ error: 'Missing quiz answers or growth plan' }, { status: 400 });
  }

  const userId = sessionData.session.user.id;

  const { error: updateError } = await supabase
    .from('creator_profiles')
    .update({
      ...quizAnswers,
      growth_plan: growthPlan,
      completed_survey: true
    })
    .eq('user_id', userId);

  if (updateError) {
    return NextResponse.json(
      { error: `Failed to update creator profile: ${updateError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
