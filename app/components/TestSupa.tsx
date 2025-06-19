'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function TestSupa() {
  const [status, setStatus] = useState('Checking...')

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try a simple query on a public table
        const { data, error } = await supabase.from('test_table').select('*').limit(1)
        if (error) throw error
        setStatus(`✅ Connected to Supabase, fetched data: ${JSON.stringify(data)}`)
      } catch (err) {
        console.error(err)
        setStatus('❌ Failed to connect to Supabase.')
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl p-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <p>{status}</p>
      </div>
    </div>
  )
}
