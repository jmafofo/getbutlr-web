'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<'private' | 'public' | 'unlisted'>('private');
  const [audience, setAudience] = useState<'yes' | 'no' | ''>('');
  const [paidPromotion, setPaidPromotion] = useState(false);
  const [alteredContent, setAlteredContent] = useState<'yes' | 'no' | ''>('');
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState('');
  const [captionCertification, setCaptionCertification] = useState('None');
  const [recordingDate, setRecordingDate] = useState('');
  const [videoLocation, setVideoLocation] = useState('');
  const [allowEmbedding, setAllowEmbedding] = useState(true);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [remixOption, setRemixOption] = useState<'both' | 'audioOnly' | 'none'>('both');
  const [category, setCategory] = useState('Entertainment');
  const [comments, setComments] = useState<'on' | 'off'>('on');
  const [moderation, setModeration] = useState('none');
  const [sortCommentsBy, setSortCommentsBy] = useState('top');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [applyingTrendIndex, setApplyingTrendIndex] = useState<number | null>(null);
  const [selectedTrending, setSelectedTrending] = useState<number | null>(null);
  
  const [idea, setIdea] = useState('');
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [templates, setTemplates] = useState<{ title: string; description: string; tags: string }[]>([]);
  console.log(process.env.RAPIDAPI_KEY);
  const fetchTrendingVideos = async () => {
        const res = await fetch(`/api/youtube/trending?q=${encodeURIComponent(idea)}`);
        const data = await res.json();
        setTrendingVideos(data.items);
    };
    useEffect(() => {
        if (trendingVideos.length > 0) setLoading(false);
      }, [trendingVideos]);
  const handleSelectTrending = (video: any, idx: number) => {
        setSelectedTrending(idx);
      
        const base = {
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnail,
          views: video.snippet.views,
          description: `Check out this new video based on trending topic: ${video.snippet.title}`,
          tags: video.snippet.title.split(' ').slice(0, 5).join(','),
        };
      
        setTemplates([
          base,
          { ...base, title: `[2025] ${base.title}`, description: `${base.description}\nDon't forget to like!` },
          { ...base, title: `🔥 ${base.title}`, description: `Inspired by trending now!\n${base.description}` },
        ]);
      };

    const formatViews = (num: number) => {
        if (!num) return '0';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toString();
      };
      

    const applyTemplate = async (tpl: { title: string; description: string; tags: string }, tidx: number) => {
        setApplyingTrendIndex(tidx); 
        const query = `Enhance this YouTube video template to make it more catchy and trending, add more description and tags, add icons. Return in JSON format:
        {
          "title": "...",
          "description": "...",
          "tags": "..."
        }
      
        Original:
        Title: ${tpl.title}
        Description: ${tpl.description}
        Tags: ${tpl.tags}`;
      
        try {
            const res = await fetch("/api/ollama_query", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query }),
            });
        
            const data = await res.json();
        
            // Extract the first valid JSON object using regex
            const match = data.insight.match(/\{[\s\S]*?\}/);
            if (!match) throw new Error("No valid JSON object found in response");

            const parsed = JSON.parse(match[0]);

            setTitle(parsed.title);
            setDescription(parsed.description);
            setTags(parsed.tags);
        } catch (err) {
            console.error("Template enhancement failed", err);
            setTitle(tpl.title);
            setDescription(tpl.description);
            setTags(tpl.tags);
        } finally {
            setApplyingTrendIndex(null);
        }
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('❌ Please select a video file');
      return;
    }

    const uploadToast = toast.loading('⏳ Uploading...');

    setLoading(true);

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
    formData.append('allowEmbedding', String(allowEmbedding));
    formData.append('notifySubscribers', String(notifySubscribers));
    formData.append('remixOption', remixOption);
    formData.append('category', category);
    formData.append('comments', comments);
    formData.append('moderation', moderation);
    formData.append('sortCommentsBy', sortCommentsBy);

    
    if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }      

    try {
      const res = await fetch('/api/youtube/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(`✅ Upload successful! Video ID: ${result.videoId}`, { id: uploadToast });
      } else {
        toast.error(`❌ Upload failed: ${result.error}`, { id: uploadToast });
      }
    } catch (err: any) {
      toast.error(`❌ Upload failed: ${err.message}`, { id: uploadToast });
    } finally {
        toast.dismiss(uploadToast);
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
    <div className="grid grid-cols-5 gap-4 p-5">
      {/* Youtube Upload Form Card Column */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-3 row-span-5"
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
            {/* Thumbnail Upload */}
            <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
                border-slate-600 hover:border-slate-500`}
            >
            <label className="block text-white mb-2">Upload Thumbnail (Optional)</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                    setThumbnail(selected);
                }
                }}
                className="hidden"
                id="thumbnailInput"
            />
            <label htmlFor="thumbnailInput" className="cursor-pointer text-slate-300">
                {thumbnail ? thumbnail.name : 'Drag & drop or click to upload'}
            </label>
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
        </div>
      </motion.div>
      {/* Hook Card Column */}
      <div className="col-span-2 col-start-4 flex flex-col space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
      <div className=" bg-slate-800 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Hook Trends</h2>
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter your idea..."
          className="w-full p-2 bg-slate-700 text-white rounded"
        />
        <button
          onClick={fetchTrendingVideos}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search Trending
        </button>
        </div>
        </motion.div>
        {loading ? (
            // Skeleton loader while loading
            Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded animate-pulse mt-2">
                <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-600 rounded w-full"></div>
                </div>
            ))
            ) : (
            trendingVideos.map((video, idx) => (
                <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                >
                <div
                    onClick={() => handleSelectTrending(video, idx)}
                    className="bg-slate-700 text-white mt-2 cursor-pointer hover:bg-slate-500 p-2 rounded"
                >
                    <div className="grid grid-cols-2 gap-4 p-5">
                    <div className="col-span-1 col-start-1 flex flex-col space-y-4">
                        <img src={video.snippet.thumbnail} className="w-50 rounded" />
                    </div>
                    <div>{video.snippet.title}</div>
                    <div>{formatViews(video.snippet.views)} views</div>
                    </div>
                </div>

                {/* Templates shown only when this video is selected */}
                {selectedTrending === idx && templates.map((tpl, tidx) => (
                <div key={tidx} className="bg-slate-800 text-white p-3 rounded mt-2 ml-4">
                    <div className="font-bold">{tpl.title}</div>
                    <p className="text-sm">{tpl.description.slice(0, 60)}...</p>
                    <button
                        onClick={() => applyTemplate(tpl, tidx)}
                        className={`mt-2 bg-gradient-to-r from-sky-400 to-blue-800 text-white font-bold px-3 py-1 rounded w-80 transition-all duration-200 ease-in-out 
                                    hover:brightness-110 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2`}
                        disabled={applyingTrendIndex === tidx}
                        >
                        {applyingTrendIndex === tidx ? (
                            <>
                            <svg
                                className="animate-spin h-4 w-4 text-white"
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
                            Applying Modification...
                            </>
                        ) : (
                            "Modify & Use"
                        )}
                        </button>
                </div>
                ))}
                </motion.div>
            ))
            )}

      </div>
      </div>
  );
}
