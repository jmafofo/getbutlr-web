// // Directory: app/tools/keyword-research/page.tsx
// "use client";

// import { useState } from "react";
// import { SessionCounter } from "@/components/SessionCounter";
// import { AdUnlockModal } from "@/components/AdUnlockModal";

// export default function KeywordResearchTool() {
//   const [keywords, setKeywords] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (topic: string) => {
//     setLoading(true);
//     const res = await fetch("/api/keyword-research", {
//       method: "POST",
//       body: JSON.stringify({ topic }),
//     });
//     const data = await res.json();
//     setKeywords(data.keywords);
//     setLoading(false);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-2">Keyword Research</h1>
//       <SessionCounter tool="keyword-research" />
//       <AdUnlockModal tool="keyword-research" />
//       {/* Input form */}
//       <input type="text" placeholder="Enter topic or niche" className="p-2 border" id="keyword-input" />
//       <button onClick={() => handleSubmit((document.getElementById('keyword-input') as HTMLInputElement).value)} className="ml-2 p-2 bg-blue-500 text-white">Generate</button>

//       {/* Results */}
//       {loading ? <p className="mt-4">Loading...</p> : (
//         <ul className="mt-4">
//           {keywords.map((k, i) => (
//             <li key={i}>{k}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// // Directory: app/tools/tag-miner/page.tsx
// "use client";

// import { useState } from "react";
// import { SessionCounter } from "@/components/SessionCounter";
// import { AdUnlockModal } from "@/components/AdUnlockModal";

// export default function TagMinerTool() {
//   const [tags, setTags] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (topic: string, platform: string) => {
//     setLoading(true);
//     const res = await fetch("/api/tag-miner", {
//       method: "POST",
//       body: JSON.stringify({ topic, platform }),
//     });
//     const data = await res.json();
//     setTags(data.tags);
//     setLoading(false);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-2">Tag Miner</h1>
//       <SessionCounter tool="tag-miner" />
//       <AdUnlockModal tool="tag-miner" />
//       {/* Input form */}
//       <input type="text" placeholder="Enter niche/topic" className="p-2 border" id="tag-topic" />
//       <select id="tag-platform" className="ml-2 p-2 border">
//         <option>YouTube</option>
//         <option>TikTok</option>
//         <option>Instagram</option>
//       </select>
//       <button onClick={() => handleSubmit((document.getElementById('tag-topic') as HTMLInputElement).value, (document.getElementById('tag-platform') as HTMLSelectElement).value)} className="ml-2 p-2 bg-green-500 text-white">Mine Tags</button>

//       {/* Results */}
//       {loading ? <p className="mt-4">Loading...</p> : (
//         <ul className="mt-4">
//           {tags.map((t: any, i: number) => (
//             <li key={i}>{t.name} — {t.percent}%</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// // Placeholder components like SessionCounter.tsx and AdUnlockModal.tsx will manage the quota and ad-unlock logic via Supabase
