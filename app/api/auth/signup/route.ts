import { NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { email, password, selectedChannelId, selectedChannelName } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const userId = data.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'User ID not returned after sign-up' }, { status: 500 })
  }

  const start = new Date()
  const exp = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days

  const { error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      tier: 'trial',
      status: 'active',
      plan: '14 days',
      trial_started: start,
      trial_expires: exp,
    })

  if (subError) {
    return NextResponse.json({ error: `Failed to create trial subscription: ${subError.message}` }, { status: 500 })
  }

  const creatorProfile = {
    user_id: userId,
    youtube_channel_id: selectedChannelId || null,
    youtube_channel_name: selectedChannelName || null,
    completed_survey: false,
  }

  const { error: creatorError } = await supabase
    .from('creator_profiles')
    .insert(creatorProfile)

  if (creatorError) {
    return NextResponse.json({ error: `Failed to save creator profile: ${creatorError.message}` }, { status: 500 })
  }

  return NextResponse.json({ user: data.user })
}
