import Link from "next/link";

const tools = [
  {
    name: "Content Performance Analyzer",
    slug: "content-performance",
    description: "Analyze your video CTR, retention, and viewer engagement."
  },
  {
    name: "Hook Analyzer",
    slug: "hook-analyzer",
    description: "Evaluate the strength of your video hooks and intros."
  },
  {
    name: "Smart Idea Generator",
    slug: "idea-generator",
    description: "Generate trending and platform-ready video ideas."
  },
  {
    name: "Weekly Growth Planner",
    slug: "growth-planner",
    description: "Get a custom posting schedule for consistent growth."
  },
  {
    name: "Voice-to-Script Recorder",
    slug: "voice-to-script",
    description: "Record audio and turn it into video scripts."
  },
  {
    name: "Comment Insight Tool",
    slug: "comment-insights",
    description: "Analyze feedback, requests, and sentiment from comments."
  }
];

export default function ToolsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Butlr AI Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block bg-white border rounded-2xl shadow-md hover:shadow-xl transition p-6 h-full"
          >
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
