"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/SideBar";

export default function SidebarWrapper() {
  const pathname = usePathname();

  // Hide sidebar on the same pages as top bar
  const hideOn = ["/signin", "/signup", "/login", "/"];
  const shouldHide = hideOn.includes(pathname);

  return !shouldHide ? <Sidebar /> : null;
}