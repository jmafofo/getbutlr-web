import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const { email, password, firstname, lastname, channelId, channelName } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Insert into creators_profile table (YouTube info)
  if (channelId && channelName) {
    const { error: creatorError } = await supabase
      .from('creators_profile')
      .insert([
        {
          user_id: data.user?.id,
          youtube_channel_id: channelId,
          youtube_channel_name: channelName,
          has_completed_survey: false,
        },
      ])

    if (creatorError) {
      return NextResponse.json({ error: `Failed to save creator profile: ${creatorError.message}` }, { status: 500 })
    }
  }

  return NextResponse.json({ user: data.user })
}
