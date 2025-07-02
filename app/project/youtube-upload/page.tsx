'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public' | 'unlisted'>('private');
  const [audience, setAudience] = useState<'yes' | 'no' | ''>('');
  const [paidPromotion, setPaidPromotion] = useState(false);
  const [alteredContent, setAlteredContent] = useState<'yes' | 'no' | ''>('');
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState('');
  const [captionCertification, setCaptionCertification] = useState('None');
  const [recordingDate, setRecordingDate] = useState('');
  const [videoLocation, setVideoLocation] = useState('');
  const [license, setLicense] = useState('Standard YouTube License');
  const [allowEmbedding, setAllowEmbedding] = useState(true);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [remixOption, setRemixOption] = useState<'both' | 'audioOnly' | 'none'>('both');
  const [category, setCategory] = useState('Gaming');
  const [comments, setComments] = useState<'on' | 'off'>('on');
  const [moderation, setModeration] = useState('none');
  const [sortCommentsBy, setSortCommentsBy] = useState('top');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a video file');
      return;
    }

    setLoading(true);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('visibility', visibility);
    formData.append('audience', audience);
    formData.append('paidPromotion', String(paidPromotion));
    formData.append('alteredContent', alteredContent);
    formData.append('tags', tags);
    formData.append('language', language);
    formData.append('captionCertification', captionCertification);
    formData.append('recordingDate', recordingDate);
    formData.append('videoLocation', videoLocation);
    formData.append('license', license);
    formData.append('allowEmbedding', String(allowEmbedding));
    formData.append('notifySubscribers', String(notifySubscribers));
    formData.append('remixOption', remixOption);
    formData.append('category', category);
    formData.append('comments', comments);
    formData.append('moderation', moderation);
    formData.append('sortCommentsBy', sortCommentsBy);

    try {
      const res = await fetch('/api/youtube/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setStatus(`✅ Upload successful! Video ID: ${result.videoId}`);
      } else {
        setStatus(`❌ Upload failed: ${result.error}`);
      }
    } catch (err: any) {
      setStatus(`❌ Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      setUrl('');
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUrl('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Upload Video to YouTube</h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label className="block font-medium text-white">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-white">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block font-medium text-white">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
                <option value="public">Public</option>
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="block font-medium text-white mb-1">Is this video made for kids?</label>
              <div className="space-x-4 text-white">
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="yes"
                    checked={audience === 'yes'}
                    onChange={() => setAudience('yes')}
                  />{' '}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="no"
                    checked={audience === 'no'}
                    onChange={() => setAudience('no')}
                  />{' '}
                  No
                </label>
              </div>
            </div>

            {/* Paid Promotion */}
            <div>
              <label className="block font-medium text-white">
                <input
                  type="checkbox"
                  checked={paidPromotion}
                  onChange={() => setPaidPromotion(!paidPromotion)}
                />{' '}
                My video contains paid promotion
              </label>
            </div>

            {/* Altered Content */}
            <div>
              <label className="block font-medium text-white mb-1">Is this altered/synthetic content?</label>
              <div className="space-x-4 text-white">
                <label>
                  <input
                    type="radio"
                    name="alteredContent"
                    value="yes"
                    checked={alteredContent === 'yes'}
                    onChange={() => setAlteredContent('yes')}
                  />{' '}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="alteredContent"
                    value="no"
                    checked={alteredContent === 'no'}
                    onChange={() => setAlteredContent('no')}
                  />{' '}
                  No
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-medium text-white">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block font-medium text-white">Video Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
                placeholder="e.g., English"
              />
            </div>

            {/* Caption Certification */}
            <div>
              <label className="block font-medium text-white">Caption Certification</label>
              <select
                value={captionCertification}
                onChange={(e) => setCaptionCertification(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="None">None</option>
                <option value="Has Captions">Has Captions</option>
                <option value="Not Required">Not Required</option>
              </select>
            </div>

            {/* Recording Date */}
            <div>
              <label className="block font-medium text-white">Recording Date</label>
              <input
                type="date"
                value={recordingDate}
                onChange={(e) => setRecordingDate(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-medium text-white">Video Location</label>
              <input
                type="text"
                value={videoLocation}
                onChange={(e) => setVideoLocation(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
                placeholder="e.g., Abu Dhabi, UAE"
              />
            </div>

            {/* License */}
            <div>
              <label className="block font-medium text-white">License</label>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="Standard YouTube License">Standard YouTube License</option>
                <option value="Creative Commons">Creative Commons</option>
              </select>
            </div>

            {/* Embedding */}
            <div>
              <label className="block font-medium text-white">
                <input
                  type="checkbox"
                  checked={allowEmbedding}
                  onChange={() => setAllowEmbedding(!allowEmbedding)}
                />{' '}
                Allow embedding
              </label>
            </div>

            {/* Notify Subscribers */}
            <div>
              <label className="block font-medium text-white">
                <input
                  type="checkbox"
                  checked={notifySubscribers}
                  onChange={() => setNotifySubscribers(!notifySubscribers)}
                />{' '}
                Publish to subscriptions feed and notify subscribers
              </label>
            </div>

            {/* Remix Option */}
            <div>
              <label className="block font-medium text-white mb-1">Remix Options</label>
              <select
                value={remixOption}
                onChange={(e) => setRemixOption(e.target.value as any)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="both">Allow video and audio remixing</option>
                <option value="audioOnly">Allow only audio remixing</option>
                <option value="none">Don't allow remixing</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium text-white">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option>Gaming</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Science & Technology</option>
                <option>People & Blogs</option>
                <option>Music</option>
              </select>
            </div>

            {/* Comments */}
            <div>
              <label className="block font-medium text-white mb-1">Comments</label>
              <select
                value={comments}
                onChange={(e) => setComments(e.target.value as any)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>

            {/* Moderation */}
            <div>
              <label className="block font-medium text-white mb-1">Comment Moderation</label>
              <select
                value={moderation}
                onChange={(e) => setModeration(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="none">None</option>
                <option value="holdPotentiallyInappropriate">Hold potentially inappropriate comments</option>
                <option value="holdAll">Hold all comments for review</option>
              </select>
            </div>

            {/* Sort Comments */}
            <div>
              <label className="block font-medium text-white mb-1">Sort Comments By</label>
              <select
                value={sortCommentsBy}
                onChange={(e) => setSortCommentsBy(e.target.value)}
                className="w-full border p-2 rounded bg-slate-700 text-white"
              >
                <option value="top">Top</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* File Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
                ${url ? 'opacity-50 pointer-events-none' : 'border-slate-600 hover:border-slate-500'}`}
            >
              <label className="block text-white mb-2">Upload Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={url.trim() !== ''}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-slate-300">
                {file ? file.name : 'Drag & drop or click to upload'}
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold mt-4 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Submit Video'}
            </motion.button>
          </form>

          {status && <p className="mt-4 text-white">{status}</p>}
        </div>
      </motion.div>
    </div>
  );
}
