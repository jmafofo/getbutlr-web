'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { animationVariants, defaultTheme } from '@/lib/uiConfig';
import Footer from '@/components/Footer';

const features = [...];
const pricing = [...];
const faqs = [...];
const testimonials = [...];

export default function LandingPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [testiIndex, setTestiIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupStatus('loading');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSignupStatus('success');
        setEmail('');
      } else {
        setSignupStatus('error');
      }
    } catch (err) {
      setSignupStatus('error');
    }
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-blue-100 dark:from-black dark:to-gray-900 p-8 text-gray-800 dark:text-white">
        {/* Hero, Features, Pricing, FAQ, Testimonials, Signup form go here */}

        <motion.section
          id="signup"
          className="py-16 text-center max-w-xl mx-auto"
          initial={animationVariants.fadeInUp.initial}
          whileInView={animationVariants.fadeInUp.animate}
          transition={animationVariants.fadeInUp.transition}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-4">Join Butlr for Free</h2>
          <p className="mb-6">Enter your email to get started and receive updates.</p>
          <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="p-3 rounded-lg shadow w-full sm:w-2/3"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              disabled={signupStatus === 'loading'}
            >
              {signupStatus === 'loading' ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          {signupStatus === 'success' && <p className="text-green-600 mt-2">Thanks! You’re on the list.</p>}
          {signupStatus === 'error' && <p className="text-red-600 mt-2">Oops! Something went wrong.</p>}
        </motion.section>
      </main>
      <Footer />
    </>
  );
}

