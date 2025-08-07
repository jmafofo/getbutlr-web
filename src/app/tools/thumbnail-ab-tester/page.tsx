// 'use client';

// import { useState, useEffect } from 'react';


// export default function ThumbnailABTester() {
//   // const { userTier, userId } = useUserContext();
//   const [imageA, setImageA] = useState<File | null>(null);
//   const [imageB, setImageB] = useState<File | null>(null);
//   const [result, setResult] = useState<{ winner: string; details: string; confidence?: number } | null>(null);
//   const [usage, setUsage] = useState<number>(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) return;
//     fetch(`/api/ai-usage?tool=thumbnail-ab-tester&user=${userId}`)
//       .then(res => res.json())
//       .then(data => setUsage(data.usage || 0));
//   }, [userId]);

//   const handleSubmit = async () => {
//     if (!imageA || !imageB || !userId) return;
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('thumbnailA', imageA);
//     formData.append('thumbnailB', imageB);

//     const res = await fetch('/api/thumbnail-score', {
//       method: 'POST',
//       body: formData,
//     });

//     const data = await res.json();
//     const winner = data.winner === 'A' ? 'Thumbnail A' : 'Thumbnail B';
//     setResult({
//       winner,
//       details: data.details || 'AI did not provide details.',
//       confidence: data.confidence || 0.85,
//     });

//     await fetch('/api/ai-usage', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         user_id: userId,
//         tool_name: 'thumbnail-ab-tester',
//         usage_type: 'vision-score',
//         api_model: 'gpt-4-vision-preview'
//       })
//     });

//     setUsage(prev => prev + 1);
//     setLoading(false);
//   };

//   const imagePreview = (file: File | null) => file ? URL.createObjectURL(file) : '';

//   return (
//     <RequireProAccess>
//       <div className="max-w-5xl mx-auto px-4 py-10">
//         <h1 className="text-3xl font-bold mb-6">🧪 A/B Thumbnail Tester</h1>
//         <p className="text-sm text-muted-foreground mb-4">
//           Upload two thumbnail options. We'll run an AI-based prediction to see which one might perform better.
//         </p>

//         <div className="flex justify-end mb-2">
//           <Badge variant="outline">AI Uses this month: {usage} / 20</Badge>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <Card>
//             <CardContent className="p-4 space-y-2">
//               <p className="font-semibold">Thumbnail A</p>
//               <Input type="file" accept="image/*" onChange={(e) => setImageA(e.target.files?.[0] || null)} />
//               {imageA && (
//                 <Image src={imagePreview(imageA)} alt="Thumbnail A" width={320} height={180} className="rounded" />
//               )}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 space-y-2">
//               <p className="font-semibold">Thumbnail B</p>
//               <Input type="file" accept="image/*" onChange={(e) => setImageB(e.target.files?.[0] || null)} />
//               {imageB && (
//                 <Image src={imagePreview(imageB)} alt="Thumbnail B" width={320} height={180} className="rounded" />
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         <Button onClick={handleSubmit} disabled={!imageA || !imageB || loading}>
//           {loading ? 'Analyzing...' : 'Run A/B Test'}
//         </Button>

//         {result && (
//           <div className="mt-6">
//             <Card>
//               <CardContent className="p-4">
//                 <h2 className="text-lg font-semibold mb-2">✅ {result.winner} is predicted to perform better!</h2>
//                 <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.details}</p>
//                 <Separator className="my-2" />
//                 <div className="flex items-center justify-between">
//                   <Badge variant="secondary">AI Scorecard (Vision) — {userTier}</Badge>
//                   {result.confidence && (
//                     <Badge variant="outline">Confidence Score: {(result.confidence * 100).toFixed(1)}%</Badge>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </RequireProAccess>
//   );
// }