'use client';

import Link from 'next/link';

export default function CoursesHome() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Creator Growth Courses</h1>
      <p className="mb-6">Your AI-enhanced journey to better content starts here. Choose a module below:</p>

      <ul className="space-y-4">
        <li><Link href="/courses/niche-review" className="text-blue-600 hover:underline">🔍 Guided Niche Review Tool</Link></li>
        <li><Link href="/courses/script-coach" className="text-blue-600 hover:underline">✍️ Script Writing Coach</Link></li>
        <li><Link href="/courses/filming-tips" className="text-blue-600 hover:underline">🎥 Camera & Filming Tips</Link></li>
        <li><Link href="/courses/editing" className="text-blue-600 hover:underline">🧪 Editing & Soundtrack Integration</Link></li>
        <li><Link href="/courses/review" className="text-blue-600 hover:underline">📋 Finishing & AI Review</Link></li>
        <li><Link href="/courses/seo-checklist" className="text-blue-600 hover:underline">📈 SEO Upload Checklist</Link></li>
      </ul>
    </main>
  );
}

