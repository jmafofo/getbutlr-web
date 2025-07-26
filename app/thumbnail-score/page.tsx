'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { supabaseClient } from '@/app/utils/supabase/client'

export default function ThumbnailScorePage() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [clipResult, setClipResult] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<{ 
    clarity_score: number,
    clarity_feedback: string,
    emotional_engagement_score: number,
    emotional_engagement_feedback: string,
    text_readability_score: number,
    text_readability_feedback: string,
    brand_consistency_score: number,
    brand_consistency_feedback: string, 
  } | null>(null);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genImage, setgenImage] = useState<{
    image: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    }
    fetchUser();
  }, []);

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;

  //   const fetchLatestTaskAndPoll = async () => {
  //     // Step 1: Get Supabase session and user_id
  //     const {
  //       data: { session },
  //       error: sessionError,
  //     } = await supabaseClient.auth.getSession();

  //     if (sessionError || !session?.user?.id) {
  //       console.error("No session or user found:", sessionError);
  //       return;
  //     }

  //     const userId = session.user.id;

  //     // Step 2: Query Supabase directly to get the latest task_id for that user
  //     const { data: tasks, error: queryError } = await supabaseClient
  //       .from("thumbnail_tasks")
  //       .select("task_id, status")
  //       .eq("user_id", userId)
  //       .order("created_at", { ascending: false })
  //       .limit(1)
  //       .maybeSingle();

  //     if (queryError) {
  //       console.error("Error fetching latest task:", queryError);
  //       return;
  //     }

  //     if (!tasks || !tasks.task_id) {
  //       console.warn("No task found for user.");
  //       return;
  //     }
  //     const latestTaskId = tasks.task_id;
  //     setTaskId(latestTaskId);

  //     // Step 3: Start polling thumbnail-status endpoint
  //     interval = setInterval(async () => {
  //       try {
  //         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_S2}/api/v1/generate-flux/status/${latestTaskId}?return_base64=false`);
  //         // console.log(res.url);
  //         if (res.status === 200 && res.url) {
  //           setgenImage({ image: res.url });
  //           setLoading(false);
  //           clearInterval(interval);
  //         }
  //       } catch (err) {
  //         console.error("Polling error:", err);
  //         clearInterval(interval);
  //         setLoading(false);
  //       }
  //     }, 3000);
  //   };

  //   fetchLatestTaskAndPoll();

  //   return () => clearInterval(interval);
  // }, []);


  // const handleImageGenSubmit = async () => {
  //   if (!title) return;
  //   setLoading(true);
  
  //   try {
  //     const formData = new FormData();
  //     formData.append('title', title);
  
  //     if (selectedFile) {
  //       formData.append('thumbnail', selectedFile);
  //     }
  
  //     const response = await fetch('/api/thumbnail-gen', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to generate thumbnail');
  //     }
  //     const data = await response.json();
  //     toast.success(`Currenly generating your image with ID: ${data.taskId}`);
  //     // setgenImage({
  //     //   image: data.image_base64,
  //     // });
  //   } catch (error) {
  //     console.error('Thumbnail generation failed:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };  

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setSelectedFile(droppedFile);
      setUrl('');
    }
  }, []);  

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUrl('');
    }
  };  

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value.trim() !== '') {
      setFile(null);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUrl('');
    setClipResult(null);
    setResult(null);
  };  

  async function submitImage({
    file,
    url,
  }: {
    file?: File;
    url?: string;
  }) {
    const formData = new FormData();

    if (file) {
      formData.append('image_file', file);
    }

    if (url) {
      formData.append('image_url', url);
    }

    const res = await fetch('/api/interrogate', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Unknown error during image submission.');
    }

    const data = await res.json();
    return data.result;
  }

  const generateImage = async (title: string, clipResult: string, taskId: string) => {
    setLoading(true);
  
    try {
      const formData = new FormData();

      formData.append('title', title);
      if (clipResult) {
        formData.append('clip_result', clipResult);
      }

      if (taskId) {
        formData.append('task_id', taskId);
      }
      // if (selectedFile) {
      //   formData.append('thumbnail', selectedFile);
      // }
  
      const response = await fetch('/api/thumbnail-gen', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate thumbnail');
      }
      const data = await response.json();
      toast.success(`Currenly generating your image with ID: ${data.taskId}`);
      // setgenImage({
      //   image: data.image_base64,
      // });
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  async function getThumbnailScore(
    clipResult: string,
    title: string,
    userId: string,
    originalFile: File
  ) {
    const formData = new FormData();
    formData.append('clip_result', clipResult);
    formData.append('title', title);
    formData.append('user_id', userId);
    formData.append('file', originalFile);
    
    const res = await fetch('/api/thumbnail-score', {
      method: 'POST',
      body: formData,
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Unknown error during thumbnail scoring.');
    }
  
    const response = await res.json();
    const scores = response.data;
  
    return {
      taskId: response.task_id ?? null,
      clarity_score: scores.clarity_score ?? 0,
      clarity_feedback: scores.clarity_feedback ?? 'No feedback',
      emotional_engagement_score: scores.emotional_engagement_score ?? 0,
      emotional_engagement_feedback: scores.emotional_engagement_feedback ?? 'No feedback',
      text_readability_score: scores.text_readability_score ?? 0,
      text_readability_feedback: scores.text_readability_feedback ?? 'No feedback',
      brand_consistency_score: scores.brand_consistency_score ?? 0,
      brand_consistency_feedback: scores.brand_consistency_feedback ?? 'No feedback',
    };
  }  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
  
    try {
      setClipResult(null);
      setResult(null);
  
      const clipRes = await submitImage({ file: selectedFile ?? undefined, url: url || undefined });
      setClipResult(clipRes);
  
      const scoreRes = await getThumbnailScore(clipRes, title, userId, selectedFile);
      setResult(scoreRes);

      await generateImage(title, clipRes, scoreRes.taskId);
      
    } catch (err: any) {
      console.error(err);
      setResult({
        clarity_score: 0,
        clarity_feedback: `Error: ${err.message || 'Failed to evaluate thumbnail'}`,
        emotional_engagement_score: 0,
        emotional_engagement_feedback: `Error: ${err.message || 'Failed to evaluate thumbnail'}`,
        text_readability_score: 0,
        text_readability_feedback: `Error: ${err.message || 'Failed to evaluate thumbnail'}`,
        brand_consistency_score: 0,
        brand_consistency_feedback: `Error: ${err.message || 'Failed to evaluate thumbnail'}`
      });
    } finally {
      setLoader(false);
    }
  };

  // Add this useEffect to debug the result state
  // useEffect(() => {
  //   console.log('Current result state:', result);
  // }, [result]);

  const isSubmitDisabled = !title.trim() || (!selectedFile && !url);

  return (
    <div className="p-5 min-h-screen relative">
      {loader ? (
        <div className="flex flex-col items-center py-4 mt-5">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Evaluating your thumbnail</h2>
          <video
            autoPlay
            loop
            muted
            className="w-56 h-56 object-contain"
            style={{ backgroundColor: 'transparent' }}
          >
            <source src="/loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Left - Upload */}
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
                ${url ? 'opacity-50 pointer-events-none' : 'border-slate-600 hover:border-slate-500'}`}
              >
                <label className="block text-white mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={url.trim() !== ''}
                  className="hidden"
                  id="fileInput"
                />
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected file preview"
                    className="mt-2 max-h-32 mx-auto rounded"
                  />
                )}

                <label htmlFor="fileInput" className="cursor-pointer text-slate-300">
                  {selectedFile ? selectedFile.name : 'Drag & drop or click to upload'}
                </label>
              </div>

              <input
                type="text"
                placeholder="Or enter image URL"
                value={url}
                onChange={handleUrlChange}
                disabled={!!file}
                className={`w-full p-3 rounded bg-slate-700 text-white border 
                ${file ? 'opacity-50 pointer-events-none' : 'border-slate-600'}`}
              />

              {(selectedFile || url) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRemove}
                  className="w-full p-3 rounded bg-slate-700 border border-slate-500 text-white font-medium hover:bg-slate-600"
                >
                  Remove Image
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={`w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold 
                ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Evaluate Thumbnail
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImageGenSubmit}
                disabled={!title || loading}
                className={`w-full p-3 rounded bg-gradient-to-l from-sky-400 to-indigo-900 text-white font-bold 
                ${!title || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                            <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                ></circle>
                                <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            Generating...
                            </>
                        ) : (
                            "Generate Sample Thumbnail"
                        )}
              </motion.button> */}
            </motion.div>
          </div>
          <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-white font-bold text-lg">Generated Sample Thumbnail</h2>
              {genImage ? (
                  <div className="mt-4 space-y-4 flex justify-center items-center">
                    {loading ? (
                      <video
                        autoPlay
                        loop
                        muted
                        className="w-32 h-32"
                      >
                        <source src="/loading.webm" type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      genImage.image && (
                        <img
                          src={genImage.image}
                          alt="Generated Thumbnail"
                          className="w-full rounded"
                        />
                      )
                    )}
                  </div>
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
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
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
