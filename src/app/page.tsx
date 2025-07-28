'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logEvent } from '@/src/lib/analytics';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscriberStatus, setSubscriberStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [selectedChannelName, setSelectedChannelName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [signupError, setSignupError] = useState('');

  const formatSubscribers = (count: string | undefined): string => {
    const num = parseInt(count || '0', 10);
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API;
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`
      );
      const searchData = await searchRes.json();

      const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(',');

      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${apiKey}`
      );
      const statsData = await statsRes.json();

      const sorted = statsData.items.sort((a: any, b: any) =>
        parseInt(b.statistics.subscriberCount || '0') -
        parseInt(a.statistics.subscriberCount || '0')
      );

      setChannels(sorted);
    } catch (err) {
      console.error('Failed to fetch channel data:', err);
    }

    setLoading(false);
  };

  const features = [
    {
      title: "SEO Suggestions",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M220.6 130.3l-67.2 28.2V43.2L98.7 233.5l54.7-24.2v130.3l67.2-209.3zm-83.2-96.7l-1.3 4.7-15.2 52.9C80.6 106.7 52 145.8 52 191.5c0 52.3 34.3 95.9 83.4 105.5v53.6C57.5 340.1 0 272.4 0 191.6c0-80.5 59.8-147.2 137.4-158zm311.4 447.2c-11.2 11.2-23.1 12.3-28.6 10.5-5.4-1.8-27.1-19.9-60.4-44.4-33.3-24.6-33.6-35.7-43-56.7-9.4-20.9-30.4-42.6-57.5-52.4l-9.7-14.7c-24.7 16.9-53 26.9-81.3 28.7l2.1-6.6 15.9-49.5c46.5-11.9 80.9-54 80.9-104.2 0-54.5-38.4-102.1-96-107.1V32.3C254.4 37.4 320 106.8 320 191.6c0 33.6-11.2 64.7-29 90.4l14.6 9.6c9.8 27.1 31.5 48 52.4 57.4s32.2 9.7 56.8 43c24.6 33.2 42.7 54.9 44.5 60.3s.7 17.3-10.5 28.5zm-9.9-17.9c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8z"/></svg>`,
      description: "AI-optimized titles, descriptions & tags",
      details: "Our AI analyzes top-performing content in your niche to generate SEO strategies that boost discoverability and ranking.",
      color: "from-green-400 to-cyan-500",
      thumbnail:"/64993.jpg",
      content: [
        "Upload your content or enter your topic",
        "Our AI analyzes competitors and trends",
        "Receive actionable recommendations",
        "Implement and track performance"
      ]
    },
    {
      title: "Thumbnail Grader",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"/></svg>`,
      description: "Score visuals & get instant feedback",
      details: "Get actionable insights on composition, color contrast, and text readability to create thumb-stopping thumbnails.",
      color: "from-amber-400 to-orange-500",
      thumbnail:"/ORSJOM0.jpg",
      content: [
        "Upload your content or enter your topic",
        "Our AI analyzes competitors and trends",
        "Receive actionable recommendations",
        "Implement and track performance"
      ]
    },
    {
      title: "A/B Testing",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M320 488c0 9.5-5.6 18.1-14.2 21.9s-18.8 2.3-25.8-4.1l-80-72c-5.1-4.6-7.9-11-7.9-17.8s2.9-13.3 7.9-17.8l80-72c7-6.3 17.2-7.9 25.8-4.1s14.2 12.4 14.2 21.9l0 40 16 0c35.3 0 64-28.7 64-64l0-166.7C371.7 141 352 112.8 352 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3L464 320c0 70.7-57.3 128-128 128l-16 0 0 40zM456 80a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM192 24c0-9.5 5.6-18.1 14.2-21.9s18.8-2.3 25.8 4.1l80 72c5.1 4.6 7.9 11 7.9 17.8s-2.9 13.3-7.9 17.8l-80 72c-7 6.3-17.2 7.9-25.8 4.1s-14.2-12.4-14.2-21.9l0-40-16 0c-35.3 0-64 28.7-64 64l0 166.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3L48 192c0-70.7 57.3-128 128-128l16 0 0-40zM56 432a24 24 0 1 0 48 0 24 24 0 1 0 -48 0z"/></svg>`,
      description: "Compare performance with real analytics",
      details: "Test different versions of your content elements and see real performance data to optimize engagement.",
      color: "from-violet-400 to-purple-500",
      thumbnail:"/9260482_4128517.jpg",
      content: [
        "Upload your content or enter your topic",
        "Our AI analyzes competitors and trends",
        "Receive actionable recommendations",
        "Implement and track performance"
      ]
    },
    {
      title: "Trend Watchlist",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"/></svg>`,
      description: "Stay ahead with real-time insights",
      details: "Receive personalized trend alerts and content opportunities based on rising topics in your category.",
      color: "from-pink-400 to-rose-500",
      thumbnail:"/stock-market-analysis-vector.jpg",
      content: [
        "Upload your content or enter your topic",
        "Our AI analyzes competitors and trends",
        "Receive actionable recommendations",
        "Implement and track performance"
      ]
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
    setSignupError(''); // Clear previous errors
  
    if (password !== confirmPassword) {
      setSignupError('❌ Passwords do not match.');
      return;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setSignupError(
        '❌ Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }
  
    setSignupStatus('loading');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, selectedChannelId, selectedChannelName }),
      })
    
      const data = await res.json()
    
      if (res.ok) {
        setSignupStatus('success')
        setSelectedChannelId('')
        setSelectedChannelName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setShowPasswordModal(false)
        router.push('/signin')
      } else {
        setSignupStatus('error')
        setSignupError(data.error || '❌ Signup failed. Email may already be used.')
      }
    } catch (err) {
      setSignupStatus('error')
      setSignupError('❌ An error occurred. Please try again.')
    }
  }

  function handleChannelClick(channel: any) {
    setSelectedChannelId(channel.id);
    setSelectedChannelName(channel.snippet.title);
    setShowPasswordModal(true);
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault(); // prevent full page reload
  
    setSubscriberStatus('loading');
    try {
      const res = await fetch('/api/subscriber', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
  
      setSubscriberStatus('success');
    } catch (err) {
      console.error(err);
      setSubscriberStatus('error');
    }
  } 

  return (
    <div className="text-white rounded-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute top-4 right-8 z-50"
      >
        <button
          type="submit"
          onClick={() => router.push('/signin')}
          className="text-white px-6 py-3 rounded-lg 
                    bg-slate-800 
                    transition-all duration-600 ease-in-out
                    hover:bg-white/10 hover:backdrop-blur-lg hover:shadow-lg 
                    hover:border hover:border-white/10 hover:text-white"
        >
          <span>User Portal</span>
        </button>
      </motion.div>

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
            AI powered social media growth platform, with intuitive dashboards at your fingertips.
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
          <div className="max-w-2xl mx-auto p-4 text-white">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input
                type="text"
                placeholder="Type your channel name or ID here"
                className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 flex-grow"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                  />
                </svg>
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </form>

            {/* Scrollable Results */}
            {hasSearched && !loading && (
                <>
                  {channels.length > 0 ? (
                    <div className="mt-6 max-h-96 overflow-y-auto space-y-4 pr-2">
                      {channels.map((channel: any) => {
                        const thumbUrl =
                          channel?.snippet?.thumbnails?.default?.url ??
                          channel?.snippet?.thumbnails?.high?.url ??
                          '';

                        return (
                          <div
                            key={channel.id}
                            onClick={() => handleChannelClick(channel)}
                            className="flex items-center gap-4 p-4 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer
                                      hover:bg-slate-700 hover:scale-[1.02] transition-all duration-200"
                          >
                            <img
                              loading="lazy"
                              src={thumbUrl || '/placeholder-channel.jpg'}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/placeholder-channel.jpg';
                              }}
                              alt={channel.snippet.title}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h2 className="text-lg font-semibold">{channel.snippet.title}</h2>
                              <p className="text-sm text-gray-400">
                                Subscribers: {formatSubscribers(channel.statistics.subscriberCount)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-6 text-center text-gray-400">
                      <img
                        src="/FreeVector-No-Signal-TV.jpg"
                        alt="No results"
                        className="mx-auto mb-4 w-34 h-24 opacity-50 rounded-lg"
                      />
                      <p>
                        No channels found for "<strong>{query}</strong>"
                      </p>
                    </div>
                  )}
                </>
              )}
          </div>
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
      <div id="features" ref={featuresRef} className="features-container">
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
              <div className="text-6xl mb-6 text-whitet">
                {feature.icon.startsWith("<svg") ? (
                  <span
                    className="inline-block w-22 h-22"
                    dangerouslySetInnerHTML={{ __html: feature.icon }}
                  />
                ) : (
                  feature.icon
                )}
              </div>
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
                    <img src={feature.thumbnail} alt={feature.title} className="max-h-full max-w-full object-contain rounded-xl" />
                  </span>
                </div>
                {/* <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold mb-3">How it works:</h3>
                  <ul className="text-left space-y-2 text-gray-200">
                    {Array.isArray(feature.content) && feature.content.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>✅</span>
                          <span>{step}</span>
                        </li>
                    ))}
                  </ul>
                </div> */}
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
                <div className="w-26 h-26">
                  <img className="rounded-xl" src="face_1.png"/>
                </div>
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
              <div className="w-26 h-26">
                  <img className="rounded-xl" src="face_2.png"/>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 italic">
                    “I doubled my video views after SEO optimization using GetButlr!”
                  </p>
                  <cite className="text-gray-400 font-medium block mt-3">— Chi P., Tech Reviewer</cite>
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
          
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
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
              disabled={subscriberStatus === 'loading'}
            >
              {subscriberStatus === 'loading' ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
          
          {subscriberStatus === 'success' && <p className="text-green-600 mt-2">Thanks! You’re on the list.</p>}
          {subscriberStatus === 'error' && <p className="text-red-600 mt-2">Oops! Something went wrong.</p>}
          
          <p className="mt-6 text-gray-500 text-sm max-w-lg mx-auto">
            By signing up, you agree to our Terms of Service and Privacy Policy. 
            GetButlr uses cookies to enhance your experience. You can unsubscribe at any time.
          </p>
        </motion.div>
      </section>

      {/* Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          {/* Loading overlay */}
          {signupStatus === 'loading' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
              <div className="text-white text-lg font-semibold">Creating Account...</div>
              <div className="ml-4 animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
            </div>
          )}

          {/* Modal content */}
          <div
            className={`bg-slate-900 rounded-xl p-8 w-full max-w-md shadow-lg text-left border border-white/10 relative transition duration-300 ${
              signupStatus === 'loading' ? 'blur-sm opacity-60 pointer-events-none' : ''
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
            <form onSubmit={handleFullSignup} className="space-y-6">
              {selectedChannelName && (
                <div>
                  <label className="block text-gray-400 mb-2">Selected Channel</label>
                  <div className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-700">
                    {selectedChannelName}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
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
                {signupError && (
                  <p className="text-red-400 text-sm mt-2">{signupError}</p>
                )}
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-white px-6 py-2"
                  disabled={signupStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={signupStatus === 'loading'}
                >
                  {signupStatus === 'loading' ? 'Processing...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}