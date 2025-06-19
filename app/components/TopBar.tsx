"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleSettings = async () => {
    router.push("/settings");
    setDropdownOpen(false);
  };

  const handleInsights = async () => {
    router.push("/insights");
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const avatarLetter = user?.email?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="w-full px-6 py-4 bg-slate-950 shadow-md flex justify-between items-center">
      <img src="/logo_btlr.svg" alt="Butlr AI Logo" className="h-8 w-auto" />
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white focus:outline-none"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              style={{
                background: "linear-gradient(to right, #8b5cf6, #ec4899)",
              }}
            >
              {avatarLetter}
            </div>
            <span>{user.email}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
              <ul className="py-1 text-sm text-gray-800">
                <li>
                  <button
                    onClick={handleInsights}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Insights
                  </button>
                </li>
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
  );
}
