'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ThumbnailScorePage() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [clipResult, setClipResult] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [result, setResult] = useState<{ 
    score: number; 
    feedback: string 
  } | null>(null);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genImage, setgenImage] = useState<{
    image: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageGenSubmit = async () => {
    if (!title) return;
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append('title', title);
  
      if (selectedFile) {
        formData.append('thumbnail', selectedFile);
      }
  
      const response = await fetch('/api/thumbnail-gen', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate thumbnail');
      }
  
      const data = await response.json();
      setgenImage({
        image: data.image_base64,
      });
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    } finally {
      setLoading(false);
    }
  };  

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

  async function getThumbnailScore(clipResult: string, title: string) {
    const res = await fetch('/api/thumbnail-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clip_result: clipResult, title }),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Unknown error during thumbnail scoring.');
    }
  
    const data = await res.json();
  
    // More flexible response handling
    if (data && (typeof data.score === 'number' || typeof data.feedback === 'string')) {
      return {
        score: data.score || 0,
        feedback: data.feedback || 'No feedback provided'
      };
    }
  
    // Fallback if response format is unexpected
    return {
      score: 0,
      feedback: 'Could not parse evaluation results'
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
  
    try {
      setClipResult(null);
      setResult(null);
  
      const clipRes = await submitImage({ file: file ?? undefined, url: url || undefined });
      setClipResult(clipRes);
  
      const scoreRes = await getThumbnailScore(clipRes, title);
      setResult(scoreRes);
      
    } catch (err: any) {
      console.error(err);
      setResult({
        score: 0,
        feedback: `Error: ${err.message || 'Failed to evaluate thumbnail'}`
      });
    } finally {
      setLoader(false);
    }
  };

  // Add this useEffect to debug the result state
  useEffect(() => {
    console.log('Current result state:', result);
  }, [result]);

  const isSubmitDisabled = !title.trim() || (!file && !url);

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
              <motion.button
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
              </motion.button>
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
                <div className="p-4 rounded text-white space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Image Preview */}
                    <div className="flex flex-col items-center">
                      {file ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Uploaded thumbnail"
                          className="max-h-64 w-auto rounded-lg object-contain"
                        />
                      ) : url ? (
                        <img
                          src={url}
                          alt="Thumbnail from URL"
                          className="max-h-64 w-auto rounded-lg object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span className="text-sm text-slate-300 mt-2">
                        Thumbnail Preview
                      </span>
                    </div>

                    {/* Score and Feedback */}
                    <div className="space-y-4">
                      <div>
                        <strong>Score:</strong> {Number.isFinite(result.score) ? result.score : 'N/A'}/100
                      </div>
                      <div>
                        <strong>Feedback:</strong>
                        <div className="prose prose-invert mt-2">
                          <ReactMarkdown>
                            {result.feedback || 'No feedback available'}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">
                  No score yet. Submit an image and title to evaluate.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
