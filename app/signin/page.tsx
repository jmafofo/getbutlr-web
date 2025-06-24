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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleSignIn = async () => {
    setMessage("Signing in...");
  
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const accessToken = signInData?.session?.access_token;
  
    if (error) {
      if (
        error.message.toLowerCase().includes("email not confirmed") ||
        error.code === "email_not_confirmed"
      ) {
        setShowVerificationModal(true);
        setMessage("");
        await resendVerification();
        return;
      }
    
      setMessage(error.message); // other errors
      return;
    }
  
    const user = signInData?.user;
    if (!user) {
      setMessage("No user data found.");
      return;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from("creator_profiles")
      .select("completed_survey")
      .eq("user_id", user.id)
      .single();
  
    if (profileError) {
      setMessage("Error fetching profile: " + profileError.message);
      return;
    }
  
    if (profileData?.completed_survey) {
      router.push("/dashboard");
    } else {
      router.push("/quiz");
    }
  
    setMessage("Signed in successfully!");
  };

  const resendVerification = async () => {
    setIsResending(true);
    setResendMessage("");
  
    const res = await fetch("/api/auth/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    const data = await res.json();
    setIsResending(false);
  
    if (res.ok) {
      setResendMessage("Verification email resent! Check your inbox.");
    } else {
      setResendMessage(`Error: ${data.error}`);
    }
  };
  

  const handleRedirectToSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white relative">
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

      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm text-center border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-2">Email not verified</h2>
            <p className="text-slate-300 mb-4 text-sm">
              You need to verify your email before signing in. Please check your inbox.
            </p>

            <button
              onClick={resendVerification}
              disabled={isResending}
              className="w-full p-2 rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold"
            >
              {isResending ? "Resending..." : "Resend Verification Email"}
            </button>

            {resendMessage && <p className="text-sm text-slate-300 mt-2">{resendMessage}</p>}

            <button
              onClick={() => setShowVerificationModal(false)}
              className="mt-4 text-slate-400 underline text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
