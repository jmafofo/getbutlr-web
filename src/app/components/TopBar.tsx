"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { Dialog } from "@headlessui/react";
import { motion } from 'framer-motion';
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from '@/src/app/utils/supabase/client'
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiSettings,
  FiUser,

} from "react-icons/fi";

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [youtubeData, setYoutubeData] = useState({
    title: '',
    description: '',
    thumbnails: {
      default: { url: '' },
      medium: { url: '' },
      high: { url: '' },
    },
  });

  const handleChannelClick = (channel: any) => {
    setSelectedChannelId(channel.id);
    setSelectedChannelName(channel.snippet.title);
  };
  

  const formatSubscribers = (count: string | undefined): string => {
    const num = parseInt(count || '0', 10);
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API;
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`
      );
      const searchData = await searchRes.json();

      const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(',');

      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${apiKey}`
      );
      const statsData = await statsRes.json();

      const sorted = statsData.items.sort((a: any, b: any) =>
        parseInt(b.statistics.subscriberCount || '0') -
        parseInt(a.statistics.subscriberCount || '0')
      );

      setChannels(sorted);
    } catch (err) {
      console.error('Failed to fetch channel data:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchYoutubeData = async () => {
      try {
        const res = await fetch("/api/youtube/profile");
        const result = await res.json();

        if (!result.success) {
          console.warn("YouTube profile not linked:", result.error);
          setShowLinkModal(true);
          return;
        }

        setYoutubeData({
          title: result.data.title,
          description: result.data.description,
          thumbnails: result.data.thumbnails,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setShowLinkModal(true);
      }
    };

    fetchYoutubeData();
  }, []);
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    fetchUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch up to 3 latest tasks with image_url not null
  const fetchTasks = async () => {
    if (!user?.id) return;
    setLoadingTasks(true);
    const { data, error } = await supabaseClient
      .from('thumbnail_tasks')
      .select('task_id, created_at')
      .eq('user_id', user.id)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);
    if (!error) setTasks(data || []);
    setLoadingTasks(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkChannel = async () => {
    if (!user || !selectedChannelId || !selectedChannelName) {
      alert('Please select a channel first.');
      return;
    }
  
    const payload = {
      userId: user.id,
      youtube_channel_id: selectedChannelId,
      youtube_channel_name: selectedChannelName,
    };
  
    try {
      const res = await fetch('/api/crud/link_channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        console.error('Error linking channel:', result.error);
        alert(`Error: ${result.error}`);
        return;
      }
  
      alert('Channel linked successfully!');
      setShowLinkModal(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Request failed:', error);
      alert('An unexpected error occurred.');
    }
  };  

  const handleSettings = async () => {
    router.push("/settings");
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  // const avatarLetter = user?.email?.charAt(0)?.toUpperCase() || "?";
  // const avatarUrl = youtubeData?.thumbnails?.default?.url || '/12225935.png';
  const maskTaskId = (id: string) => id.slice(0, 6) + '...';

  return (
    <>
    <div className="w-full px-6 py-4 bg-slate-800 text-gray-200 shadow-lg flex justify-end items-center">
      {user ? (
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          <button
            onClick={handleSettings}
            className="text-gray-300 hover:text-white focus:outline-none"
            title="Settings"
          >
            <FiSettings className="w-5 h-5" />
          </button>
          <button
          onClick={() => {
            if (!showNotifications) fetchTasks();
            setShowNotifications((prev) => !prev);
          }} // implement this if needed
          className="text-gray-300 hover:text-white focus:outline-none"
          title="Notifications"
        >
          <FiBell className="w-5 h-5" />
        </button>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="text-gray-300 hover:text-white focus:outline-none"
            >
            <FiUser className="w-5 h-5"/>
            {/* <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              style={{
                background: "linear-gradient(to right, #8b5cf6, #ec4899)",
              }}
            >
              
            </div> */}
          </button>
          {showNotifications && (
            <div className="absolute right-14 mt-[10vw] w-64 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-auto">
              <div className="py-2 px-4 text-gray-800 border-b font-semibold">
                Notifications
              </div>
              <ul>
                {tasks.length === 0 ? (
                  <li className="px-4 py-2 text-gray-500">No notifications</li>
                ) : (
                  tasks.map((task) => (
                    <li
                      key={task.task_id}
                      onClick={() => {
                        router.push(`/thumbnail/${task.task_id}`);
                        setShowNotifications(false);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b text-sm text-gray-700"
                      title={`Task ID: ${task.task_id}`}
                    >
                      🔔 Image generated with task id {maskTaskId(task.task_id)}
                    </li>
                  ))
                )}
              </ul>
              <div className="text-right px-4 py-2">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {dropdownOpen && (
            <div className="absolute right-5 mt-[115px] w-40 bg-white rounded-md shadow-lg z-50">
              <ul className="py-2 text-sm text-gray-800">
                <li>
                  <button
                    onClick={handleSettings}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <span className="text-sm text-gray-400">Not signed in</span>
      )}
    </div>
    <Dialog
        open={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Link Your YouTube Channel
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              It looks like you haven't linked your YouTube channel to the
              platform yet. Please link it to continue.
            </Dialog.Description>

            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
          <div className="max-w-2xl mx-auto p-4 text-white">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input
                type="text"
                placeholder="Type your channel name or ID here"
                className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 flex-grow"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                  />
                </svg>
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </form>

            {/* Scrollable Results */}
            {hasSearched && !loading && (
                <>
                  {channels.length > 0 ? (
                    <div className="mt-6 max-h-96 overflow-y-auto space-y-4 pr-2">
                      {channels.map((channel: any) => {
                        const thumbUrl =
                          channel?.snippet?.thumbnails?.default?.url ??
                          channel?.snippet?.thumbnails?.high?.url ??
                          '';

                        return (
                          <div
                            key={channel.id}
                            onClick={() => handleChannelClick(channel)}
                            className={`flex items-center gap-4 p-4 rounded-lg border ${
                              selectedChannelId === channel.id
                                ? 'border-blue-200 bg-slate-500 scale-[1.02]'
                                : 'border-slate-600 bg-slate-800'
                            } cursor-pointer hover:bg-slate-400 hover:scale-[1.02] transition-all duration-200`}
                          >
                            <img
                              loading="lazy"
                              src={
                                channel?.snippet?.thumbnails?.default?.url ??
                                channel?.snippet?.thumbnails?.high?.url ??
                                '/placeholder-channel.jpg'
                              }
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/placeholder-channel.jpg';
                              }}
                              alt={channel.snippet.title}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h2 className="text-lg font-semibold">{channel.snippet.title}</h2>
                              <p className="text-sm text-gray-400">
                                Subscribers: {formatSubscribers(channel.statistics.subscriberCount)}
                              </p>
                            </div>
                          </div>

                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-6 text-center text-gray-400">
                      <img
                        src="/FreeVector-No-Signal-TV.jpg"
                        alt="No results"
                        className="mx-auto mb-4 w-34 h-24 opacity-50 rounded-lg"
                      />
                      <p>
                        No channels found for "<strong>{query}</strong>"
                      </p>
                    </div>
                  )}
                </>
              )}
          </div>
          </motion.div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded bg-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkChannel}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Link Now
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
