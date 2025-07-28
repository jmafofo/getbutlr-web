'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/src/app/utils/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Video {
  id: string;
  user_id: string;
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchVideos = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        setVideos([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabaseClient
        .from('youtube_uploads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching videos:', error.message);
      } else {
        setVideos(data as Video[]);
      }
      setLoading(false);
    };
    fetchVideos();
  }, []);
  console.log(videos[1]?.thumbnail_url ?? "No thumbnail available");


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">My Uploaded YouTube Videos</h1>

      {loading ? (
        <p className="text-white">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-slate-400">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800 rounded-2xl shadow-md overflow-hidden hover:scale-105 transform transition"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    width={400}
                    height={225}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-[225px] bg-slate-700 flex items-center justify-center text-slate-300">
                    No thumbnail_url
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-white">{video.title}</h2>
                  <p className="text-sm text-slate-400 line-clamp-3">{video.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Uploaded: {new Date(video.created_at).toLocaleString()}
                  </p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
