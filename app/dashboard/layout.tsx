'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart, CreditCard, Settings, Menu, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navSections = [
    {
      header: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: <Home size={16} /> },
        { href: '/dashboard/insights', label: 'Insights', icon: <BarChart size={16} /> },
      ],
    },
    {
      header: 'Account',
      items: [
        { href: '/dashboard/subscription', label: 'Subscription', icon: <CreditCard size={16} /> },
        { href: '/dashboard/preferences', label: 'Preferences', icon: <Settings size={16} /> },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-gray-100 dark:bg-gray-900 p-4 transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0' : 'h-auto'}`}>
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          </div>
          <nav className="space-y-4">
            {navSections.map((section) => (
              <div key={section.header}>
                {!isCollapsed && (
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {section.header}
                  </h3>
                )}
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                        pathname === item.href ? 'bg-blue-200 dark:bg-gray-800 font-semibold' : ''
                      }`}
                    >
                      {item.icon}
                      <span
                        className={`transition-opacity duration-300 ${
                          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-4">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <User size={16} />
            <span
              className={`transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
            >
              My Profile
            </span>
          </Link>
        </div>
      </aside>
      <main className="flex-grow p-6 bg-white dark:bg-black text-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  );
}

