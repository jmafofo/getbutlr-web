'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from "@/lib/supabaseClient";
import { motion } from 'framer-motion'

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    setMessage("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in successfully!");
      router.push("/insights");
    }
  };

  const handleRedirectToSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          Welcome Back to Butlr
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-slate-300 mt-4"
        >
          Sign in to continue
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 space-y-4 max-w-md mx-auto"
        >
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            className="w-full p-3 rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold"
          >
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRedirectToSignup}
            className="w-full p-3 rounded bg-slate-800 border border-slate-600 text-slate-300 hover:border-white"
          >
            Don’t have an account? Sign Up
          </motion.button>

          {message && <p className="text-sm text-slate-300 mt-2">{message}</p>}
        </motion.div>
      </div>
    </div>
  )
}
