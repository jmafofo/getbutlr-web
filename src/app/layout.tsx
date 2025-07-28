import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWrapper from "./components/ChatWrapper";
import TopBarWrapper from "@/src/app/components/TopBarWrapper";
import SidebarWrapper from "@/src/app/components/SidebarWrapper";
import FootWrapper from "./components/FooterWrapper";
import "./globals.css"
import { AuthProvider } from '@/src/lib/AuthContext';
// import AuthProvider from '@/app/components/AuthProvider';
import BillingWrapper from './components/BillingWrapper';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Butlr Platform",
  description: "All in One - SEO Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased flex h-full">
        <AuthProvider>
          <SidebarWrapper />
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden shadow-lg">
            <TopBarWrapper />
            <BillingWrapper />
            <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 overflow-auto">
              {children}
              <Toaster position="top-right" reverseOrder={false} />
            </main>
            <ChatWrapper />
            <FootWrapper />
          </div>
        </AuthProvider>  
      </body>
    </html>
  );
}