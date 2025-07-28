"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/src/app/components/SideBar";
import { hideOnRoutes } from "@/src/app/constants/toHide";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const shouldHide = hideOnRoutes.includes(pathname);

  return !shouldHide ? <Sidebar /> : null;
}