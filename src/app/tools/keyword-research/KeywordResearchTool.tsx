// "use client";

// import { useState } from "react";
// import { SessionCounter } from "@/components/SessionCounter";
// import { AdUnlockModal } from "@/components/AdUnlockModal";

// export default function KeywordResearchTool() {
//   const [keywords, setKeywords] = useState<any[]>([]);
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

//   const handleCopy = () => {
//     const text = keywords.map(k => `${k.keyword}, ${k.volume}, ${k.difficulty}`).join("\n");
//     navigator.clipboard.writeText(text);
//   };

//   const handleExport = () => {
//     const csv = ["Keyword,Volume,Difficulty", ...keywords.map(k => `${k.keyword},${k.volume},${k.difficulty}`)].join("\n");
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'keywords.csv';
//     a.click();
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-2">Keyword Research</h1>
//       <SessionCounter tool="keyword-research" />
//       <AdUnlockModal tool="keyword-research" />
//       <input type="text" placeholder="Enter topic or niche" className="p-2 border" id="keyword-input" />
//       <button onClick={() => handleSubmit((document.getElementById('keyword-input') as HTMLInputElement).value)} className="ml-2 p-2 bg-blue-500 text-white">Generate</button>

//       {keywords.length > 0 && (
//         <div className="mt-4">
//           <button onClick={handleCopy} className="p-2 text-sm bg-gray-200 mr-2">Copy</button>
//           <button onClick={handleExport} className="p-2 text-sm bg-gray-200">Export CSV</button>
//         </div>
//       )}

//       {loading ? <p className="mt-4">Loading...</p> : (
//         <ul className="mt-4">
//           {keywords.map((k, i) => (
//             <li key={i}>{k.keyword} – {k.volume} searches, difficulty {k.difficulty}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
