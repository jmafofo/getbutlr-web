'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">GetButlr</div>
      <nav>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/tools/hook-analyzer">Hook Analyzer</Link></li>
          <li><Link href="/tools/content-analyzer">Content Analyzer</Link></li>
          <li><Link href="/tools/smart-ideas">Smart Ideas</Link></li>
          <li><Link href="/dashboard/profile">Profile</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
