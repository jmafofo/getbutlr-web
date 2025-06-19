'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async () => {
    setMessage('Creating account...')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname }),
    })

    const data = await res.json()
    if (data.error) {
      setMessage(data.error)
    } else {
      setMessage('Signup successful! Please check your email.')
      // Optionally redirect after signup:
      // router.push('/signin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          Create your Butlr account
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 space-y-4 max-w-md mx-auto"
        >
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="text"
            placeholder="First Name"
            value={email}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="text"
            placeholder="Last Name"
            value={email}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="password"
            placeholder="Retype your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignup}
            className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
          >
            Sign Up
          </motion.button>

          {message && <p className="text-sm text-slate-300 mt-2">{message}</p>}

          <p className="text-sm text-slate-400 mt-4">
            Already have an account?{' '}
            <button
              className="underline text-purple-400 hover:text-pink-400"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
