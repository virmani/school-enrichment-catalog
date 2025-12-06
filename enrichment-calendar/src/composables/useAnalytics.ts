export function useAnalytics() {
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  };

  const trackClassMinimize = (className: string, sessionId: string) => {
    trackEvent('class_minimized', {
      class_name: className,
      session_id: sessionId,
    });
  };

  const trackClassRestore = (className: string, sessionId: string) => {
    trackEvent('class_restored', {
      class_name: className,
      session_id: sessionId,
    });
  };

  const trackRestoreAll = (count: number) => {
    trackEvent('restore_all', {
      class_count: count,
    });
  };

  const trackScreenshotGenerated = (kidName: string) => {
    trackEvent('screenshot_generated', {
      kid_name: kidName,
    });
  };

  const trackStatusChange = (
    className: string,
    sessionId: string,
    oldStatus: 'signed_up' | 'considering' | null,
    newStatus: 'signed_up' | 'considering' | null
  ) => {
    trackEvent('class_status_changed', {
      class_name: className,
      session_id: sessionId,
      old_status: oldStatus || 'none',
      new_status: newStatus || 'none',
    });
  };

  return {
    trackEvent,
    trackClassMinimize,
    trackClassRestore,
    trackRestoreAll,
    trackScreenshotGenerated,
    trackStatusChange,
  };
}
