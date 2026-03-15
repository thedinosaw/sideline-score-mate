import { useEffect, useRef } from 'react';

export function useWakeLock(enabled: boolean) {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled) {
      wakeLock.current?.release();
      wakeLock.current = null;
      return;
    }

    async function request() {
      try {
        if ('wakeLock' in navigator) {
          wakeLock.current = await navigator.wakeLock.request('screen');
        }
      } catch {}
    }

    request();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) request();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      wakeLock.current?.release();
    };
  }, [enabled]);
}
