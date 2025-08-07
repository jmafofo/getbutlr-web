'use client';

import { useRouter } from 'next/navigation';
import {
    FiMusic,
    FiUploadCloud,
    FiMessageCircle,
    FiBarChart2,
    FiCalendar,
    FiActivity,
    FiBookOpen,
    FiUserCheck,
    FiTrendingUp,
    FiCheckCircle,
    FiZap,
    FiSun,
    FiSearch,
    FiClipboard,
    FiShield,
    FiTag,
    FiStar,
    FiLayers,
    FiImage,
    FiEdit3,
    FiUsers,
    FiMic,
  } from 'react-icons/fi';
  
  const appItems = [
    {
      name: 'Audience Insights',
      path: '/tools/audience-insights',
      icon: FiUsers,
      bgColor: 'bg-gradient-to-tr from-cyan-400 to-blue-600',
      iconColor: 'text-white',
    },
    {
      name: 'Audio Trends',
      path: '/tools/audio-trends',
      icon: FiMusic,
      bgColor: 'bg-gradient-to-tr from-indigo-500 to-purple-600',
      iconColor: 'text-white',
    },
    {
      name: 'Boost',
      path: '/tools/boost',
      icon: FiUploadCloud,
      bgColor: 'bg-gradient-to-tr from-green-500 to-teal-600',
      iconColor: 'text-white',
    },
    {
      name: 'Comment Insights',
      path: '/tools/comment-insights',
      icon: FiMessageCircle,
      bgColor: 'bg-gradient-to-tr from-yellow-400 to-orange-500',
      iconColor: 'text-white',
    },
    {
      name: 'Content Analyzer',
      path: '/tools/content-analyzer',
      icon: FiBarChart2,
      bgColor: 'bg-gradient-to-tr from-red-400 to-pink-500',
      iconColor: 'text-white',
    },
    {
      name: 'Content Calendar',
      path: '/tools/content-calendar',
      icon: FiCalendar,
      bgColor: 'bg-gradient-to-tr from-purple-600 to-indigo-700',
      iconColor: 'text-white',
    },
    {
      name: 'Content Performance',
      path: '/tools/content-performance',
      icon: FiActivity,
      bgColor: 'bg-gradient-to-tr from-blue-500 to-cyan-600',
      iconColor: 'text-white',
    },
    {
      name: 'Creator Academy',
      path: '/tools/creator-academy',
      icon: FiBookOpen,
      bgColor: 'bg-gradient-to-tr from-pink-500 to-red-600',
      iconColor: 'text-white',
    },
    {
      name: 'Creator Coach',
      path: '/tools/creator-coach',
      icon: FiUserCheck,
      bgColor: 'bg-gradient-to-tr from-teal-400 to-green-600',
      iconColor: 'text-white',
    },
    {
      name: 'Growth Planner',
      path: '/tools/growth-planner',
      icon: FiTrendingUp,
      bgColor: 'bg-gradient-to-tr from-yellow-400 to-yellow-600',
      iconColor: 'text-white',
    },
    {
      name: 'Growth Review',
      path: '/tools/growth-review',
      icon: FiCheckCircle,
      bgColor: 'bg-gradient-to-tr from-cyan-400 to-blue-600',
      iconColor: 'text-white',
    },
    {
      name: 'Hook Analyzer',
      path: '/tools/hook-analyzer',
      icon: FiZap,
      bgColor: 'bg-gradient-to-tr from-indigo-400 to-purple-600',
      iconColor: 'text-white',
    },
    {
      name: 'Idea Generator',
      path: '/tools/idea-generator',
      icon: FiSun,
      bgColor: 'bg-gradient-to-tr from-red-400 to-pink-600',
      iconColor: 'text-white',
    },
    {
      name: 'Keyword Research',
      path: '/tools/keyword-research',
      icon: FiSearch,
      bgColor: 'bg-gradient-to-tr from-green-400 to-teal-600',
      iconColor: 'text-white',
    },
    {
      name: 'Metadata Grade',
      path: '/tools/metadata-grade',
      icon: FiClipboard,
      bgColor: 'bg-gradient-to-tr from-yellow-400 to-orange-600',
      iconColor: 'text-white',
    },
    {
      name: 'SEO Checklist',
      path: '/tools/seo-checklist',
      icon: FiShield,
      bgColor: 'bg-gradient-to-tr from-blue-400 to-indigo-700',
      iconColor: 'text-white',
    },
    {
      name: 'Tag Miner',
      path: '/tools/tag-miner',
      icon: FiTag,
      bgColor: 'bg-gradient-to-tr from-pink-400 to-red-600',
      iconColor: 'text-white',
    },
    {
      name: 'Tag Ranker',
      path: '/tools/tag-ranker',
      icon: FiStar,
      bgColor: 'bg-gradient-to-tr from-purple-400 to-indigo-600',
      iconColor: 'text-white',
    },
    {
      name: 'Thumbnail AB Tester',
      path: '/tools/thumbnail-ab-tester',
      icon: FiLayers,
      bgColor: 'bg-gradient-to-tr from-cyan-400 to-blue-600',
      iconColor: 'text-white',
    },
    {
      name: 'Thumbnail Generator',
      path: '/tools/thumbnail-generator',
      icon: FiImage,
      bgColor: 'bg-gradient-to-tr from-green-400 to-teal-600',
      iconColor: 'text-white',
    },
    {
      name: 'Title Rewriter',
      path: '/tools/title-rewriter',
      icon: FiEdit3,
      bgColor: 'bg-gradient-to-tr from-yellow-400 to-orange-600',
      iconColor: 'text-white',
    },
    {
      name: 'Voice to Script',
      path: '/tools/voice-to-script',
      icon: FiMic,
      bgColor: 'bg-gradient-to-tr from-purple-500 to-indigo-700',
      iconColor: 'text-white',
    },
  ];
  

export default function AppsPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-6">
      <h1 className="text-white text-4xl font-extrabold mb-12">My Tools</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 max-w-6xl w-full">
        {appItems.map(({ name, path, icon: Icon, bgColor, iconColor }) => (
          <button
            key={name}
            onClick={() => handleNavigation(path)}
            className={`${bgColor} aspect-square rounded-3xl flex flex-col justify-center items-center p-4 shadow-lg transform transition-transform hover:scale-110 active:scale-95 focus:outline-none`}
          >
            <Icon className={`${iconColor} text-5xl mb-3 drop-shadow-lg`} />
            <span className="text-white text-center font-semibold text-sm select-none">{name}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
