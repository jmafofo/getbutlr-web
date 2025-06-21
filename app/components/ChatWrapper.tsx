"use client";

import { usePathname } from "next/navigation";
import { hideOnRoutes } from "@/app/constants/toHide";
import  ChatWidget  from '@/lib/ChatWidget';

export default function ChatWrapper() {
  const pathname = usePathname();
  const shouldHide = hideOnRoutes.includes(pathname);

  return !shouldHide ? <ChatWidget /> : null;
}
