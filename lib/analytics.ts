export function logEvent(event: string, props: Record<string, any> = {}) {
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.analytics?.track) {
        win.analytics.track(event, props);
      } else if (win.gtag) {
        win.gtag('event', event, props);
      }
    }
  }
  