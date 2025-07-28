import { NextResponse } from 'next/server'
import { createClient } from '@/src/app/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient();
  const { email, password } = await request.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json({ user: data.user, session: data.session })
}
