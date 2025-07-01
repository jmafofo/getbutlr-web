
'use client';

import { useEffect } from 'react';
import { logEvent } from '@/lib/analytics';
import ToolCard from '@/components/ToolCard';

const tools = [
  {
    name: 'SEO Coach',
    href: '/tools/seo-checklist',
    description: 'Optimize your video titles, tags, and descriptions',
    icon: '🔍',
  },
  {
    name: 'Thumbnail Coach',
    href: '/tools/thumbnail-score',
    description: 'Score and improve your thumbnails for higher CTR',
    icon: '🖼️',
  },
  {
    name: 'Content Analyzer',
    href: '/tools/content-analyzer',
    description: 'Break down what works in your current videos',
    icon: '📊',
  },
  {
    name: 'Voice-to-Script',
    href: '/tools/voice-script',
    description: 'Turn your audio ideas into full video scripts',
    icon: '🎙️',
  },
  {
    name: 'Comment Insights',
    href: '/tools/comment-insights',
    description: 'AI-powered feedback from your community',
    icon: '💬',
  },
  {
    name: 'Smart Idea Generator',
    href: '/tools/idea-generator',
    description: 'Generate new content ideas from trending topics',
    icon: '⚡',
  },
];

export default function DashboardPage() {
  useEffect(() => {
    logEvent('dashboard_viewed');
  }, []);

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">🎛️ Your Creator Dashboard</h1>
        <p className="dashboard-subtitle">All your tools in one place—ready when you are.</p>
      </header>

      <section className="tool-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool.name}
            title={tool.name}
            icon={tool.icon}
            description={tool.description}
            href={tool.href}
          />
        ))}
      </section>
    </main>
  );
}
