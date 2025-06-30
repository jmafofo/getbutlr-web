'use client';

import '../styles/landing.css';
import { logEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    logEvent('landing_viewed', { hook: 'Grow Smarter, Not Harder' });
  }, []);

  const startTrial = () => {
    logEvent('free_trial_clicked', { from: 'landing_hero' });
    router.push('/signup');
  };

  return (
    <main className="lp-container sky-background">
      {/* Logo at top */}
      <div className="logo-wrapper">
        <Image
          src="/logo-getbutlr.png"
          alt="GetButlr Logo"
          width={220}
          height={220}
          className="logo-image"
          priority
        />
      </div>

      <section className="hero">
        <h1 className="hero-title">Where Creators<br />Grow Smarter.</h1>
        <p className="tagline">Turn insight into influence with AI that works.</p>
        <p className="subtag">
          All-in-one AI platform to help you rank higher, hook faster, and grow your audience—
          with less guesswork and more results.
        </p>
        <button className="cta" onClick={startTrial}>Start Free Trial</button>
      </section>

      <section className="features">
        <h2>📊 Everything You Need to Grow</h2>
        <ul className="feature-list">
          <li>🔍 <strong>SEO Engine:</strong> AI-curated titles, tags & descriptions that rank</li>
          <li>🎯 <strong>Audience Targeting:</strong> Promote to real viewers likely to engage</li>
          <li>📸 <strong>Thumbnail Coach:</strong> Score, improve, and test your visuals</li>
          <li>💡 <strong>Trend Scanner:</strong> Spot what’s rising—before it explodes</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>🎤 What Creators Are Saying</h2>
        <div className="testimonial-cards">
          <blockquote>
            “The thumbnail coach alone paid for my subscription in 3 days.”<br />
            <cite>— Amy J., Cooking Creator</cite>
          </blockquote>
          <blockquote>
            “SEO and promotion tools doubled my views. This is my secret weapon.”<br />
            <cite>— Raj P., Tech Reviewer</cite>
          </blockquote>
        </div>
      </section>

      <section className="final-cta">
        <h2>🚀 Ready to Grow Smarter?</h2>
        <button className="cta" onClick={startTrial}>Start 14-Day Free Trial</button>
      </section>
    </main>
  );
}
