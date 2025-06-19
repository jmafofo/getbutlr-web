
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { supabase } from '@/lib/supabaseClient';
import ChatWidget from '../lib/ChatWidget';
import BillingBanner from "../app/components/BillingBanner";
import "./globals.css"

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BillingBanner />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

