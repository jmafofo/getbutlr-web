'use client';

import Link from 'next/link';

const navSections = [
  {
    title: '🧠 AI Tools',
    items: [
      { name: 'Hook Analyzer', href: '/tools/hook-analyzer' },
      { name: 'Content Analyzer', href: '/tools/content-analyzer' },
      { name: 'Smart Ideas', href: '/tools/smart-ideas' },
    ],
  },
  {
    title: '📢 Promotion',
    items: [
      { name: 'Boost Tool', href: '/tools/boost' },
    ],
  },
  {
    title: '👤 Account',
    items: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Profile', href: '/dashboard/profile' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">GetButlr</div>
      <nav>
        {navSections.map((section) => (
          <div key={section.title} className="nav-section">
            <h3 className="sidebar-title">{section.title}</h3>
            <ul className="nav-list">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="nav-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
