'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

/** Provider que inicializa PostHog no client side */
export function AnalyticsProvider({ children }: { children: React.ReactNode }): JSX.Element {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
