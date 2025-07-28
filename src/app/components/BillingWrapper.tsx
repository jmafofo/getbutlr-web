"use client";

import { usePathname } from "next/navigation";
import { hideOnRoutes } from "@/src/app/constants/toHide";
import BillingBanner from "./BillingBanner";

export default function BillingWrapper() {
  const pathname = usePathname();
  const shouldHide = hideOnRoutes.includes(pathname);

  return !shouldHide ? <BillingBanner /> : null;
}
