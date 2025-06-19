"use client";

import { usePathname } from "next/navigation";
import TopBar from "../components/TopBar";

export default function TopBarWrapper() {
  const pathname = usePathname();

  // Hide top bar only on sign-in page
  const hideOn = ["/signin", "/login", "/"];
  const shouldHide = hideOn.includes(pathname);

  return !shouldHide ? <TopBar /> : null;
}
