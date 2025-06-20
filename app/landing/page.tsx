'use client';
import '../styles/landing.css';
import { logEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    <main className="lp-container">
      <section className="hero">
        <h1>Grow Smarter, Not Harder</h1>
        <p className="tagline">
          AI-powered tools that optimize SEO, thumbnails, trends & more—
          all in one intuitive dashboard.
        </p>
        <p className="subtag">
          Start your <strong>14‑day free trial</strong>—no credit card required.
        </p>
        <button className="cta" onClick={startTrial}>Start Free Trial</button>
      </section>

      <section className="features">
        <h2>Become the Creator You Deserve to Be</h2>
        <ul className="feature-list">
          <li>🔍 <strong>SEO Suggestions:</strong> AI-optimized titles, descriptions & tags</li>
          <li>📸 <strong>Thumbnail Grader:</strong> Score visuals & get instant feedback</li>
          <li>🧪 <strong>A/B Testing:</strong> Compare performance with real analytics</li>
          <li>📈 <strong>Trend Watchlist:</strong> Stay ahead with real-time insights</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>What Creators Are Saying</h2>
        <div className="testimonial-cards">
          <blockquote>
            “GetButlr’s thumbnail AI lifted my CTR by 35% in just a week!”<br />
            <cite>— Amy J., Cooking Creator</cite>
          </blockquote>
          <blockquote>
            “I doubled my video views after SEO optimization using GetButlr!”<br />
            <cite>— Raj P., Tech Reviewer</cite>
          </blockquote>
        </div>
      </section>

      <section className="final-cta">
        <h2>Ready to Level Up Your Channel?</h2>
        <button className="cta" onClick={startTrial}>Start 14-Day Free Trial</button>
      </section>
    </main>
  );
}

