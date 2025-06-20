'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Footer from './components/Footer';
import TestimonialCarousel from './components/TestimonialCarousel';
import { animationVariants, defaultTheme } from './lib/uiConfig';

const features = [
  "AI-powered SEO optimized titles and tag generation",
  "Script writing guidance to increase viewer engagement",
  "Audience targeting and growth recommendations using AI",
  "Thumbnail A/B testing and visual performance suggestions",
  "Promotional support and exposure guarantees",
  "Video upload checklist to maximize SEO reach",
  "Content creator course modules: niche review, filming, editing"
];

const pricing = [
  {
    title: "Free Plan",
    price: "$0",
    features: ["Basic AI Title & Tag Generator", "Limited Insights", "Email Tips"],
    cta: "/signup"
  },
  {
    title: "Creator+",
    price: "$10/mo",
    features: ["Unlimited Suggestions", "Thumbnail A/B Testing", "Weekly Growth Email"],
    cta: "/subscribe?plan=creator"
  },
  {
    title: "Studio Pro",
    price: "$29/mo",
    features: ["All Creator+ features", "Course Library Access", "Priority Support"],
    cta: "/subscribe?plan=studio"
  }
];

const faqs = [
  {
    q: "What platforms does Butlr support?",
    a: "We currently support YouTube with plans for TikTok and Instagram Reels soon."
  },
  {
    q: "Can I use Butlr for free?",
    a: "Yes! You can access basic features and upgrade anytime."
  },
  {
    q: "What kind of courses do you offer?",
    a: "We offer step-by-step guidance on scriptwriting, video editing, and niche analysis tailored to your content."
  }
];

const testimonials = [
  {
    name: "Jay from The Angler's Tales",
    text: "Butlr helped me grow my fishing channel more in 3 weeks than the past 6 months. Highly recommend."
  },
  {
    name: "Layla Vlogs",
    text: "I love how easy it is to test thumbnails and get AI insights. Butlr is a game changer."
  },
  {
    name: "TechTalk UAE",
    text: "The content courses are surprisingly useful and affordable. Production quality up 10x!"
  }
];

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
      <main className="bg-white dark:bg-black text-gray-800 dark:text-gray-100">
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

        <motion.section
          id="quiz-promo"
          className="py-16 text-center bg-blue-50 dark:bg-blue-950"
          initial={animationVariants.fadeInUp.initial}
          whileInView={animationVariants.fadeInUp.animate}
          transition={animationVariants.fadeInUp.transition}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Not sure where to begin?</h2>
          <p className="mb-6">Take our quiz and get AI-powered feedback on your niche, style, and video opportunities.</p>
          <Link href="/courses">
            <button className="bg-black text-white px-8 py-3 rounded-full shadow hover:bg-gray-800">Start Quiz</button>
          </Link>
        </motion.section>

        <TestimonialCarousel testimonials={testimonials} />
      </main>
      <Footer />
    </>
  );
}

