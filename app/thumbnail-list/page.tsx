'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/app/utils/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ThumbnailTask {
  task_id: string;
  title: string;
  original_thumbnail_url: string | null;
  created_at: string;
}

export default function ThumbnailListPage() {
  const [tasks, setTasks] = useState<ThumbnailTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      const userId = session?.user?.id;
      if (!userId) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabaseClient
        .from('thumbnail_tasks')
        .select('task_id, title, original_thumbnail_url, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching thumbnail tasks:', error.message);
      } else {
        setTasks(data as ThumbnailTask[]);
      }

      setLoading(false);
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-5 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-white">My Thumbnail Tasks</h1>

      {loading ? (
        <p className="text-white">Loading thumbnails...</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-400">No thumbnails found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div
                key={task.task_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-slate-800 rounded-2xl shadow-md overflow-hidden hover:scale-105 transform transition"
            >
                {/* Delete Button */}
                <button
                onClick={async (e) => {
                    e.preventDefault(); // Prevent Link navigation
                    const { error } = await supabaseClient
                    .from('thumbnail_tasks')
                    .delete()
                    .eq('task_id', task.task_id);

                    if (error) {
                    console.error('Error deleting task:', error.message);
                    } else {
                    setTasks((prev) => prev.filter((t) => t.task_id !== task.task_id));
                    }
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded z-10"
                >
                Delete
                </button>

                <Link href={`/thumbnail/${task.task_id}`}>
                {task.original_thumbnail_url ? (
                    <Image
                    src={task.original_thumbnail_url}
                    alt={task.title}
                    width={400}
                    height={225}
                    className="w-full h-auto"
                    />
                ) : (
                    <div className="w-full h-[225px] bg-slate-700 flex items-center justify-center text-slate-300">
                    No thumbnail image
                    </div>
                )}
                <div className="p-4">
                    <h2 className="text-lg font-bold text-white">{task.title}</h2>
                    <p className="text-xs text-slate-500 mt-2">
                    Created: {new Date(task.created_at).toLocaleString()}
                    </p>
                </div>
                </Link>
            </motion.div>
            ))}

        </div>
      )}
    </div>
  );
}
