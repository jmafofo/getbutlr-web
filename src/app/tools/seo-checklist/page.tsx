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
      {/* <ToolHeader
        title="SEO Checklist"
        icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
        subtitle="Optimize your YouTube video metadata for search visibility and ranking."
      />

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Free Tips</h2>
        <div className="space-y-2">
          {freeTips.map((tip, idx) => (
            <TipCard key={`free-${idx}`} tip={tip} />
          ))}
        </div>
      </section>

      <RequireProAccess plan="Creator+">
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2 text-purple-600">Pro Tips</h2>
          <div className="space-y-2">
            {proTips.map((tip, idx) => (
              <TipCard key={`pro-${idx}`} tip={tip} isPro />
            ))}
          </div>
        </section>
      </RequireProAccess> */}
    </div>
  );
}