'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent } from './analytics';

export function LogAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const path = pathname + (searchParams ? `?${searchParams.toString()}` : '');
    logEvent('page_view', { path });
  }, [pathname, searchParams]);

  return null;
}

