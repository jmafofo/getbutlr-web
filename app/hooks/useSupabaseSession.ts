import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function useSupabaseSession() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  
    const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession)
    })
  
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])
  
  return session
}
