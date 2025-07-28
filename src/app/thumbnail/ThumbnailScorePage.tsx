'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { supabaseClient } from '@/src/app/utils/supabase/client'

interface ThumbnailScorePageProps {
  taskId: string;
}

export default function ThumbnailScorePage() {
  const { taskId } = useParams(); 
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [clipResult, setClipResult] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genImage, setGenImage] = useState<{ image: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tasks, setTask] = useState<{ task_id: string; title: string }[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);

  // Fetch specific task by taskId + all tasks list
  useEffect(() => {
    const fetchTaskData = async () => {
      const { data: current, error: currentErr } = await supabaseClient
        .from('thumbnail_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (currentErr) {
        console.error('Error fetching task:', currentErr);
      } else {
        setTask(current);
        setTitle(current?.title ?? '');
      }
      setResult(current);
      console.log(current);
    };

    fetchTaskData();
  }, [taskId]);

  // Polling the backend for thumbnail status
  // useEffect(() => {
  //   if (!taskId) return;

  //   let interval: NodeJS.Timeout;

  //   interval = setInterval(async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL_S2}/api/v1/generate-flux/status/${taskId}?return_base64=false`
  //       );

  //       if (res.status === 200) {
  //         const json = await res.json();
  //         if (json.url) {
  //           setGenImage({ image: json.url });
  //           clearInterval(interval);
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Polling error:', err);
  //       clearInterval(interval);
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [taskId]);

  return (
    <div className="p-5 min-h-screen relative">
      {loader ? (
        <div className="flex flex-col items-center py-4 mt-5">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Evaluating your thumbnail</h2>
          <video autoPlay loop muted className="w-56 h-56 object-contain" style={{ backgroundColor: 'transparent' }}>
            <source src="/loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        // Your existing JSX for form, buttons, image preview, and scoring goes here unchanged
        // Just remove the code that sets taskId internally or fetches it
        // You can reuse your existing JSX return block here.
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Left - Upload */}
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-white font-bold text-lg">Generated Sample Thumbnail</h2>
              {result?.image_url ? (
                  <img
                  src={result.image_url}
                  alt="Generated Thumbnail"
                  className="w-full rounded"
                />
                ) : (
                  <div className="text-slate-400">
                    No image yet. Image thumbnail will be generated from the title
                  </div>
                )}
              </motion.div>
          </div>
          {/* Right - Thumbnail Score */}
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-white font-bold text-lg">Thumbnail Scoring</h2>

              {result ? (
                <div className="p-6 rounded-lg bg-white dark:bg-slate-900 shadow-md space-y-6 text-gray-900 dark:text-white">
                  {/* Thumbnail Preview */}
                  <div className="flex flex-col items-center">
                    {result.original_thumbnail_url ? (
                      <img
                        src={result.original_thumbnail_url}
                        alt="Uploaded thumbnail"
                        className="max-h-64 w-auto rounded-xl object-contain"
                      />
                    ) : url ? (
                      <img
                        src={url}
                        alt="Thumbnail from URL"
                        className="max-h-64 w-auto rounded-xl object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className="text-sm text-slate-400 mt-3">Thumbnail Preview</span>
                  </div>

                  {/* Scoring Breakdown */}
                  <div className="space-y-6">
                    {[
                      {
                        label: 'Clarity & Composition',
                        score: result.clarity_score,
                        feedback: result.clarity_feedback,
                      },
                      {
                        label: 'Emotional Engagement',
                        score: result.emotional_engagement_score,
                        feedback: result.emotional_engagement_feedback,
                      },
                      {
                        label: 'Text Readability',
                        score: result.text_readability_score,
                        feedback: result.text_readability_feedback,
                      },
                      {
                        label: 'Brand Consistency',
                        score: result.brand_consistency_score,
                        feedback: result.brand_consistency_feedback,
                      },
                    ].map(({ label, score, feedback }, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-base">{label}</h3>
                          <div className="text-sm font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                            {score}/10
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all"
                            style={{ width: `${(score / 10) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {feedback || 'No feedback provided.'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // fallback when result is null
                <div className="text-sm text-slate-500 text-center py-8">Awaiting evaluation result...</div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
