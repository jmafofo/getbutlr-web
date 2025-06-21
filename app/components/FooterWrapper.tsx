"use client";

import { usePathname } from "next/navigation";
import { hideOnRoutes } from "@/app/constants/toHide";
import Footer from "./Footer";

export default function FootWrapper() {
  const pathname = usePathname();
  const shouldHide = hideOnRoutes.includes(pathname);

  return !shouldHide ? <Footer /> : null;
}
