// app/tools/seo-checklist/page.tsx

'use client';

import React from 'react';

const freeTips = [
  'Use keywords naturally in your title and description.',
  'Add hashtags to improve discoverability.',
  'Include your main keyword in the first sentence of your description.',
  'Avoid clickbait — keep titles truthful and engaging.',
];

const proTips = [
  'Structure your description with timestamp chapters.',
  'Use LSI keywords to support your primary keyword.',
  'Include outbound links for credibility (e.g., citations or source articles).',
  'Add contact and social info at the bottom of the description.',
];

export default function SEOChecklistPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SEO Checklist</h1>
      <p className="text-gray-600 mb-6">
        Optimize your YouTube video metadata for search visibility and ranking.
      </p>

      {/* Free Tips */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Free Tips</h2>
        <ul className="list-disc list-inside space-y-1">
          {freeTips.map((tip, idx) => (
            <li key={`free-${idx}`} className="text-gray-800">
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Pro Tips */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2 text-purple-600">Pro Tips</h2>
        <ul className="list-disc list-inside space-y-1">
          {proTips.map((tip, idx) => (
            <li key={`pro-${idx}`} className="text-gray-800">
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
