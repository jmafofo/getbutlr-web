'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'SEO Coach', href: '/tools/seo-checklist', icon: '🔍' },
  { name: 'Thumbnail Coach', href: '/tools/thumbnail-score', icon: '🖼️' },
  { name: 'Content Analyzer', href: '/tools/content-analyzer', icon: '📈' },
  { name: 'Voice-to-Script', href: '/tools/voice-script', icon: '🎙️' },
  { name: 'Comment Insights', href: '/tools/comment-insights', icon: '💬' },
  { name: 'Smart Idea Generator', href: '/tools/idea-generator', icon: '⚡' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">🧠 GetButlr</h2>
      <nav>
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

