"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { stripEmailDomain } from "@/app/utils/rmEmail";
import {
  FiHome,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiSearch,
  FiCamera,
  FiDivide,
  FiMusic,
  FiVideo,
  FiEdit,
  FiTag,
  FiCheckCircle,
  FiSliders,
  FiLink,
  FiShield,
  FiCoffee,
  FiTool,
  FiCrosshair,
  FiActivity,
  FiLayers,
  FiTriangle,
  FiVoicemail
} from "react-icons/fi";

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [youtubeData, setYoutubeData] = useState({
    title: "Name",
    description: "Description",
    thumbnails: {
      default: {
        url: ""
      },
      medium: {
        url: ""
      },
      high: {
        url: ""
      }
    }
  });

  useEffect(() => {
    const fetchYoutubeData = async () => {
      const res = await fetch('/api/youtube-profile');
      const data = await res.json();
      setYoutubeData(data);
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
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    // Close menu after navigation if sidebar is collapsed
    if (isCollapsed) {
      setActiveMenu(null);
    }
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Close all menus when collapsing
    if (!isCollapsed) {
      setActiveMenu(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const avatarLetter = user?.email?.charAt(0)?.toUpperCase() || "?";

  const menuItems = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "/dashboard",
      submenu: []
    },
    {
      name: "SEO Suggestion",
      icon: FiSearch,
      path: "/insights",
      submenu: []
    },
    {
      name: "Thumbnail Scoring",
      icon: FiCamera,
      path: "/thumbnail-score",
      submenu: []
    },
    {
      name: "A/B Testing",
      icon: FiDivide,
      path: "/ab-testing",
      submenu: []
    },
    {
      name: "Courses",
      icon: FiTrendingUp,
      submenu: [
        { name: "Editing Sound", path: "/courses/editing-sound", icon: FiMusic },
        { name: "Filming Tips", path: "/courses/filming-tips", icon: FiVideo },
        { name: "Script Coach", path: "/courses/script-coach", icon: FiEdit },
        { name: "Niche Review", path: "/courses/niche-review", icon: FiTag },
        { name: "SEO Checklist", path: "/courses/seo-checklist", icon: FiCheckCircle }
      ]
    },
    {
      name: "Tools",
      icon: FiTool,
      submenu: [
        { name: "Comment Insights", path: "/tools/comment-insights", icon: FiCrosshair },
        { name: "Content Performance", path: "/tools/content-performance", icon: FiActivity },
        { name: "Growth Planner", path: "/tools/growth-planner", icon: FiTrendingUp },
        { name: "Hook Analyzer", path: "/tools/hook-analyzer", icon: FiTriangle },
        { name: "Idea Generator", path: "/tools/idea-generator", icon: FiLayers },
        { name: "Voice to Script", path: "/tools/voice-to-script", icon: FiVoicemail }
      ]
    },
    {
      name: "Configuration",
      icon: FiSettings,
      submenu: [
        { name: "Preferences", path: "/config/preferences", icon: FiSliders },
        { name: "Subscription", path: "/subscription", icon: FiCoffee },
        { name: "Integrations", path: "/config/integrations", icon: FiLink },
        { name: "Security", path: "/config/security", icon: FiShield }
      ]
    }
  ];

  return (
    <div className={`${isCollapsed ? "w-15" : "w-64"} bg-slate-900 text-gray-200 h-full flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Collapse Toggle Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-gradient-to-r from-amber-900 to-yellow-300 rounded-full flex items-center justify-center text-white shadow-md"
            style={{
              fontSize: "1vw",
            }}
          >
            <img className="w-9 h-9 rounded-full shadow-md" src={youtubeData.thumbnails.default.url}/>
            {/* {avatarLetter} */}
          </div>
          {!isCollapsed && (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="col-12-m">
              <p className="font-small truncate">
                {stripEmailDomain(user?.email)}
              </p>
              <p className="text-l text-gray-400">Gold</p>
            </div>
            {/* <div className="col-12-m">
              <p className="text-l text-gray-400">{youtubeData.title}</p>
            </div> */}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.submenu.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-6 py-3 hover:bg-slate-800 transition-colors ${
                      activeMenu === item.name ? "bg-slate-800" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="text-lg" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (activeMenu === item.name ? <FiChevronUp /> : <FiChevronDown />)}
                  </button>
                  
                  {!isCollapsed && activeMenu === item.name && (
                    <ul className="ml-10 py-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <button
                            onClick={() => handleNavigation(subItem.path)}
                            className={`w-full text-left px-4 py-2 hover:bg-slate-800 rounded transition-colors flex items-center gap-2 ${
                              pathname === subItem.path ? "text-purple-400" : ""
                            }`}
                          >
                            {subItem.icon && <subItem.icon className="text-sm text-gray-400" />}
                            {subItem.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleNavigation(item.path!)}
                  className={`w-full text-left flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
                    pathname === item.path ? "text-purple-400" : ""
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <item.icon className="text-lg" />
                  {!isCollapsed && <span>{item.name}</span>}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-slate-800 rounded transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut className="text-lg" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}