"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import { hideOnRoutes } from "@/src/app/constants/toHide";

export default function TopBarWrapper() {
  const pathname = usePathname();
  const shouldHide = hideOnRoutes.includes(pathname);

  return !shouldHide ? <TopBar /> : null;
}
