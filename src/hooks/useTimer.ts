import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  initialSeconds: number;
  halfDurationSeconds: number;
  isRunning: boolean;
  timerStartedAt: string | null;
  onHalfTime: () => void;
  onTick: (seconds: number) => void;
}

export function useTimer({
  initialSeconds,
  halfDurationSeconds,
  isRunning,
  timerStartedAt,
  onHalfTime,
  onTick,
}: UseTimerProps) {
  const [displaySeconds, setDisplaySeconds] = useState(initialSeconds);
  const halfTimeTriggered = useRef(false);
  const prevRunning = useRef(isRunning);

  // Reset half time trigger when timer is reset
  useEffect(() => {
    if (initialSeconds === 0) halfTimeTriggered.current = false;
  }, [initialSeconds]);

  // When not running, sync display to initial
  useEffect(() => {
    if (!isRunning) {
      setDisplaySeconds(initialSeconds);
    }
  }, [isRunning, initialSeconds]);

  useEffect(() => {
    if (!isRunning || !timerStartedAt) return;

    const startedAt = new Date(timerStartedAt).getTime();
    const baseSeconds = initialSeconds;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const current = baseSeconds + elapsed;
      setDisplaySeconds(current);
      onTick(current);

      if (!halfTimeTriggered.current && current >= halfDurationSeconds) {
        halfTimeTriggered.current = true;
        onHalfTime();
      }
    }, 250); // Update 4x/sec for responsiveness

    return () => clearInterval(interval);
  }, [isRunning, timerStartedAt, initialSeconds, halfDurationSeconds, onHalfTime, onTick]);

  return displaySeconds;
}
