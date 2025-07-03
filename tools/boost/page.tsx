// tools/boost/page.tsx

'use client';

import BoostPanel from '@/components/BoostPanel';

export default function BoostToolPage() {
  return (
    <div className="tool-wrapper">
      <header className="tool-header">
        <h1 className="tool-title">📈 Video Boost Tool</h1>
        <p className="tool-description">
          Identify the best audience segments and platforms to promote your content. Powered by smart targeting and performance signals.
        </p>
      </header>

      <section className="tool-body">
        <BoostPanel />
      </section>
    </div>
  );
}

