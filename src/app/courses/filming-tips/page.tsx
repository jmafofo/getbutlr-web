'use client';

export default function FilmingTipsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6">🎥 Filming Tips & Gear Suggestions</h1>
      <p className="mb-4">Upgrade your content quality with smart tips and affordable gear suggestions tailored to your creator level.</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🎬 Budget-Based Gear Picks</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Starter Kit:</strong> Smartphone + natural light + lav mic</li>
          <li><strong>Intermediate:</strong> Mirrorless camera + LED softbox + tripod</li>
          <li><strong>Pro Setup:</strong> DSLR + multi-light rig + shotgun mic</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📚 Free Short Courses</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><a href="https://www.youtube.com/results?search_query=filming+tips+for+creators" target="_blank" rel="noopener" className="text-blue-600 underline">Filming Tips Playlist on YouTube</a></li>
          <li><a href="https://www.coursera.org/courses?query=video+production" target="_blank" rel="noopener" className="text-blue-600 underline">Video Production Courses on Coursera</a></li>
          <li><a href="https://www.skillshare.com/browse/video-editing" target="_blank" rel="noopener" className="text-blue-600 underline">Editing Tips on Skillshare</a></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📸 Common Mistakes to Avoid</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Shooting against bright windows</li>
          <li>Recording audio without external mic</li>
          <li>Unstable handheld shots</li>
        </ul>
      </section>
      </div>
    </div>
  );
}