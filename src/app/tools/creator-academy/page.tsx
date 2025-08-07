'use client';

import { useState } from 'react';

const modules = [
  {
    title: 'SEO Fundamentals',
    access: 'free',
    description: 'Understand how titles, tags, and descriptions affect visibility.',
  },
  {
    title: 'Thumbnail Psychology',
    access: 'pro',
    description: 'Learn what drives clicks using design theory and emotion.',
  },
  {
    title: 'Retention & Storytelling',
    access: 'pro',
    description: 'Master intros, pacing, and cliffhangers that keep viewers engaged.',
  },
  {
    title: 'Analytics Deep Dive',
    access: 'free',
    description: 'Make decisions using CTR, AVD, and RPM to grow smart.',
  },
  {
    title: 'Monetization Tactics',
    access: 'pro',
    description: 'Explore affiliate, merch, and sponsorship integration.',
  },
];

export default function CreatorAcademy() {
  const [selected, setSelected] = useState<typeof modules[0] | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🎓 Creator Academy</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upskill your creator journey with quick modules on SEO, thumbnails, storytelling, and monetization.
        </p>
      </div>

      {!selected ? (
        <div className="grid md:grid-cols-2 gap-4">
          {modules.map((mod, i) => (
            <div
              key={i}
              onClick={() => setSelected(mod)}
              className="cursor-pointer border rounded-md p-4 hover:shadow-md transition bg-white dark:bg-zinc-900"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">{mod.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    mod.access === 'free'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {mod.access === 'free' ? 'Free' : 'Pro'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{mod.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <hr className="border-gray-300 dark:border-gray-700 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">📘 {selected.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{selected.description}</p>

          <div className="h-[300px] p-4 rounded border border-gray-300 bg-gray-100 dark:bg-zinc-800 overflow-y-auto">
            {selected.access === 'pro' ? (
              <>
                <p className="text-sm text-green-600">✅ You have access to this pro module.</p>
                <p className="mt-4 text-gray-400 text-xs">(Course content placeholder)</p>
              </>
            ) : (
              <>
                <p className="text-sm text-green-600">✅ This is a free module.</p>
                <p className="mt-4 text-gray-400 text-xs">(Course content placeholder)</p>
              </>
            )}
          </div>

          <button
            onClick={() => setSelected(null)}
            className="mt-6 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            ← Back to Modules
          </button>
        </div>
      )}
    </div>
  );
}
