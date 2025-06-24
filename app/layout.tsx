import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWrapper from "./components/ChatWrapper";
import BillingBanner from "../app/components/BillingBanner";
import TopBarWrapper from "@/app/components/TopBarWrapper";
import SidebarWrapper from "@/app/components/SidebarWrapper";
import FootWrapper from "./components/FooterWrapper";
import "./globals.css"
import { supabase } from "@/lib/supabaseClient";
import AuthProvider from '@/app/components/AuthProvider';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-full`}>
      <AuthProvider>
        <SidebarWrapper />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden shadow-lg">
          <TopBarWrapper />
          <BillingBanner />
          <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 overflow-auto p-5">
            {children}            
          </main>
          <ChatWrapper />
          <FootWrapper/>
        </div>
      </AuthProvider>  
      </body>
      
    </html>
  );
}