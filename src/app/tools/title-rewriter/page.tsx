// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import TitleResultCard from '@/components/TitleResultCard';

// export default function TitleRewriterPage() {
//   const [inputTitle, setInputTitle] = useState('');
//   const [rewrites, setRewrites] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function handleRewrite() {
//     setLoading(true);
//     const res = await fetch('/api/title-rewriter', {
//       method: 'POST',
//       body: JSON.stringify({ title: inputTitle }),
//     });
//     const data = await res.json();
//     setRewrites(data.rewrites || []);
//     setLoading(false);
//   }

//   return (
//     <div className="max-w-3xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-bold mb-4">🎯 Title Rewriter</h1>
//       <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
//         Enter your current video title and get improved, high-performing alternatives.
//       </p>

//       <div className="flex space-x-2 mb-6">
//         <Input
//           placeholder="Paste your current video title..."
//           value={inputTitle}
//           onChange={(e) => setInputTitle(e.target.value)}
//         />
//         <Button onClick={handleRewrite} disabled={loading || !inputTitle}>
//           {loading ? 'Rewriting...' : 'Rewrite'}
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {rewrites.map((title, idx) => (
//           <TitleResultCard key={idx} title={title} />
//         ))}
//       </div>
//     </div>
//   );
// }
