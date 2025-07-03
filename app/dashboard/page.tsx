'use client';

import Link from 'next/link';
import { FaLightbulb, FaBullseye, FaRegCommentDots, FaChartBar, FaMicrophone, FaRobot } from 'react-icons/fa';

const tools = {
  'AI Coaching Tools': [
    {
      icon: <FaChartBar />,
      title: 'Content Performance',
      description: 'Analyze how your videos perform over time.',
      href: '/tools/content-performance',
    },
    {
      icon: <FaLightbulb />,
      title: 'Hook Analyzer',
      description: 'Evaluate your video hooks for retention power.',
      href: '/tools/hook-analyzer',
    },
    {
      icon: <FaRobot />,
      title: 'Smart Ideas',
      description: 'Generate fresh, viral video ideas.',
      href: '/tools/idea-generator',
    },
    {
      icon: <FaMicrophone />,
      title: 'Voice-to-Script',
      description: 'Convert spoken ideas into scripts instantly.',
      href: '/tools/voice-to-script',
    },
  ],
  'Audience Insight Tools': [
    {
      icon: <FaRegCommentDots />,
      title: 'Comment Insights',
      description: 'See what your audience is really saying.',
      href: '/tools/comment-insights',
    },
    {
      icon: <FaBullseye />,
      title: 'Weekly Growth Planner',
      description: 'Plan your weekly content goals and strategy.',
      href: '/tools/growth-planner',
    },
  ],
  'Promotion Tools': [
    {
      icon: <FaBullseye />,
      title: 'Boost Planner',
      description: 'AI-powered targeting for paid promotions.',
      href: '/boost',
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="tool-grid">
      {Object.entries(tools).map(([group, groupTools]) => (
        <section key={group}>
          <h2 className="sidebar-title">{group}</h2>
          <div className="tool-grid">
            {groupTools.map(({ icon, title, description, href }) => (
              <Link href={href} key={title} className="tool-card">
                <div className="tool-icon">{icon}</div>
                <div>
                  <div className="tool-name">{title}</div>
                  <div className="tool-description">{description}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
