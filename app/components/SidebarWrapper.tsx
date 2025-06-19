"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/SideBar";
import { hideOnRoutes } from "@/app/constants/toHide";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const shouldHide = hideOnRoutes.includes(pathname);

  return !shouldHide ? <Sidebar /> : null;
}