'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/uiConfig';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupStatus('loading');
    // Validate email format or do any pre-checks
    if (!email) return;
    setSignupStatus('idle');
    setShowPasswordModal(true); // Open modal
  }

  async function handleFullSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setSignupStatus('loading');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setSignupStatus('success');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowPasswordModal(false);
      } else {
        setSignupStatus('error');
      }
    } catch (err) {
      setSignupStatus('error');
    }
  }

  return (
    <div className="text-white flex flex-col items-center justify-center flex-1">
      <div className="w-full max-w-xl px-6 text-center">
        <motion.section
          id="signup"
          className="py-16 text-center max-w-xl mx-auto"
          initial={animationVariants.fadeInUp.initial}
          whileInView={animationVariants.fadeInUp.animate}
          transition={animationVariants.fadeInUp.transition}
          viewport={{ once: true }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Join Butlr for Free
          </motion.h1>
          <p className="mb-6">Enter your email to get started and receive updates.</p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 sm:w-2/3"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              disabled={signupStatus === 'loading'}
            >
              {signupStatus === 'loading' ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
          {signupStatus === 'success' && <p className="text-green-600 mt-2">Thanks! You’re on the list.</p>}
          {signupStatus === 'error' && <p className="text-red-600 mt-2">Oops! Something went wrong.</p>}
        </motion.section>
      </div>

      {/* Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-lg text-left">
            <h2 className="text-xl font-semibold mb-4">Set Your Password</h2>
            <form onSubmit={handleFullSignup} className="space-y-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Retype Password"
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
