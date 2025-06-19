'use client'

import { useRouter } from 'next/navigation'
import { Button } from "../components/ui/Button"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function SignOutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Error signing out: ' + error.message)
      return
    }
    router.push('/signin')
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold"
    >
      Sign Out
    </Button>
  )
}
