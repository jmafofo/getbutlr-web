import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  const { email, password, firstname, lastname } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname,
        lastname,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { error: profileError } = await supabase
    .from('profile')
    .insert([
      {
        user_id: data.user?.id,
        first_name: firstname,
        last_name: lastname,
        has_completed_survey: false,
      },
    ]);

  if (profileError) {
    return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 })
  }

  return NextResponse.json({ user: data.user })
}
