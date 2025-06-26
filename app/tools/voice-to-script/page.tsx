'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith('audio/') || droppedFile.type.startsWith('video/'))
    ) {
      setFile(droppedFile);
    } else {
      setError('Please upload an audio or video file.');
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transcriber', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to transcribe');
      } else {
        setResult(data.transcription);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Audio/Video Transcription
          </h1>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-slate-500 rounded-lg p-6 text-center cursor-pointer hover:border-slate-300"
          >
            <label className="block text-white mb-2">
              Upload Audio or Video
            </label>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-slate-300"
            >
              {file ? file.name : 'Drag & drop or click to upload'}
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={loading}
            className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold mt-4 disabled:opacity-50"
          >
            {loading ? 'Transcribing...' : 'Upload & Transcribe'}
          </motion.button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800 rounded-2xl shadow-md p-6"
      >
        {result ? (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">
              Transcription Result:
            </h2>
            <p className="bg-gray-100 p-4 rounded text-black">{result}</p>
          </div>
        ) : (
          <p className="text-slate-400">
            Transcription will appear here after upload.
          </p>
        )}
      </motion.div>
    </div>
  );
}
