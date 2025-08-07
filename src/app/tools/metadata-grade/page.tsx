
'use client';

import Link from 'next/link';

const tools = [
  { name: "SEO Checklist", path: "/tools/seo-checklist" },
  { name: "Boost", path: "/tools/boost" },
  { name: "Comment Insight", path: "/tools/comment-insights" },
  { name: "Tag Ranker", path: "/tools/tag-ranker" },
  { name: "Metadata Grade", path: "/tools/metadata-grade" },
  { name: "Idea Generator", path: "/tools/idea-generator" },
  { name: "Growth Planner", path: "/tools/growth-planner" },
  { name: "Growth Review", path: "/tools/growth-review" },
  { name: "Creator Academy", path: "/tools/creator-academy" },
  { name: "Audio Trends", path: "/tools/audio-trends" },
  { name: "Hook Analyzer", path: "/tools/hook-analyzer" },
  { name: "Content Analyzer", path: "/tools/content-analyzer" },
  { name: "Voice to Script", path: "/tools/voice-to-script" },
  { name: "Content Calendar", path: "/tools/content-calendar" },
  { name: "Title Rewriter", path: "/tools/title-rewriter" },
  { name: "Thumbnail Generator", path: "/tools/thumbnail-generator" },
  { name: "A/B Thumbnail Tester", path: "/tools/thumbnail-ab-tester" },
];

export default function ToolsIndexPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🧰 All Tools</h1>
      <ul className="space-y-3">
        {tools.map(tool => (
          <li key={tool.name}>
            <Link href={tool.path}>
              <span className="block p-4 border rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                {tool.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
