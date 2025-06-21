'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/uiConfig';
import { logEvent } from '@/lib/analytics';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "SEO Suggestions",
      icon: "🔍",
      description: "AI-optimized titles, descriptions & tags",
      details: "Our AI analyzes top-performing content in your niche to generate SEO strategies that boost discoverability and ranking.",
      color: "from-green-400 to-cyan-500"
    },
    {
      title: "Thumbnail Grader",
      icon: "📸",
      description: "Score visuals & get instant feedback",
      details: "Get actionable insights on composition, color contrast, and text readability to create thumb-stopping thumbnails.",
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "A/B Testing",
      icon: "🧪",
      description: "Compare performance with real analytics",
      details: "Test different versions of your content elements and see real performance data to optimize engagement.",
      color: "from-violet-400 to-purple-500"
    },
    {
      title: "Trend Watchlist",
      icon: "📈",
      description: "Stay ahead with real-time insights",
      details: "Receive personalized trend alerts and content opportunities based on rising topics in your category.",
      color: "from-pink-400 to-rose-500"
    }
  ];

  useEffect(() => {
    logEvent('landing_viewed', { hook: 'Grow Smarter, Not Harder' });
    
    // Handle keyboard and wheel events for feature navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentFeature(prev => Math.min(prev + 1, features.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentFeature(prev => Math.max(prev - 1, 0));
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0) {
          setCurrentFeature(prev => Math.min(prev + 1, features.length - 1));
        } else {
          setCurrentFeature(prev => Math.max(prev - 1, 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Scroll to current feature
  useEffect(() => {
    if (featuresRef.current) {
      const featureElement = featuresRef.current.children[currentFeature] as HTMLElement;
      if (featureElement) {
        window.scrollTo({
          top: featureElement.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  }, [currentFeature]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupStatus('loading');
    if (!email) return;
    setSignupStatus('idle');
    setShowPasswordModal(true);
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
    <div className="text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-br from-slate-900 to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Grow Smarter, Not Harder
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            AI-powered tools that optimize SEO, thumbnails, trends & more—all in one intuitive dashboard.
          </motion.p>
          
          <motion.p 
            className="text-lg text-gray-400 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Start your <strong className="text-white">14‑day free trial</strong>—no credit card required.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <a 
              href="#features" 
              className="cta bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 inline-block"
              onClick={() => {
                logEvent('free_trial_clicked', { from: 'landing_hero' });
                setCurrentFeature(0);
              }}
            >
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 animate-bounce"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="text-gray-400 text-sm mb-2">Scroll to explore</div>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </section>

      {/* Features Section - Full Page Scrolling */}
      <div ref={featuresRef} className="features-container">
        {features.map((feature, index) => (
          <section 
            key={index}
            id={`feature-${index}`}
            className={`min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br ${feature.color} to-slate-900`}
          >
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{feature.title}</h2>
                <p className="text-xl mb-6">{feature.description}</p>
                <p className="text-gray-200">{feature.details}</p>
              </motion.div>
              
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-gray-800 rounded-xl aspect-video flex items-center justify-center">
                  <span className="text-gray-400">
                    {feature.title} Visualization
                  </span>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold mb-3">How it works:</h3>
                  <ul className="space-y-2 text-gray-200">
                    <li>• Upload your content or enter your topic</li>
                    <li>• Our AI analyzes competitors and trends</li>
                    <li>• Receive actionable recommendations</li>
                    <li>• Implement and track performance</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </section>
        ))}
      </div>

      {/* Testimonials */}
      <section className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Creators Are Saying
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <p className="text-gray-300 italic">
                    “GetButlr's thumbnail AI lifted my CTR by 35% in just a week!”
                  </p>
                  <cite className="text-gray-400 font-medium block mt-3">— Amy J., Cooking Creator</cite>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <p className="text-gray-300 italic">
                    “I doubled my video views after SEO optimization using GetButlr!”
                  </p>
                  <cite className="text-gray-400 font-medium block mt-3">— Raj P., Tech Reviewer</cite>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-slate-900 to-blue-900/30">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Join Butlr for Free
          </motion.h2>
          
          <p className="mb-8 text-gray-300 text-xl">Enter your email to get started and receive updates.</p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 flex-grow"
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
          
          <p className="mt-6 text-gray-500 text-sm max-w-lg mx-auto">
            By signing up, you agree to our Terms of Service and Privacy Policy. 
            GetButlr uses cookies to enhance your experience. You can unsubscribe at any time.
          </p>
        </motion.div>
      </section>

      {/* Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-xl p-8 w-full max-w-md shadow-lg text-left border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
            <form onSubmit={handleFullSignup} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Retype your password"
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-white px-6 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
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