import { NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const { error: subError } = await supabase
    .from('signups')
    .insert({
      email: email
    })

  if (subError) {
    return NextResponse.json({ error: `Failed to subscribe: ${subError.message}` }, { status: 500 })
  }
  return NextResponse.json({ message: 'Successfully subscribed' }, { status: 200 });
}