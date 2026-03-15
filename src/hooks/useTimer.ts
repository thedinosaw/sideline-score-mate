import { useState, useEffect, useRef } from 'react';

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
  const baseSecondsRef = useRef(initialSeconds);
  const onHalfTimeRef = useRef(onHalfTime);
  const onTickRef = useRef(onTick);

  // Keep callback refs fresh
  onHalfTimeRef.current = onHalfTime;
  onTickRef.current = onTick;

  // Reset half time trigger when timer is reset
  useEffect(() => {
    if (initialSeconds === 0) halfTimeTriggered.current = false;
  }, [initialSeconds]);

  // When not running, sync display and base to initialSeconds
  useEffect(() => {
    if (!isRunning) {
      setDisplaySeconds(initialSeconds);
      baseSecondsRef.current = initialSeconds;
    }
  }, [isRunning, initialSeconds]);

  // Capture base seconds when timer starts
  useEffect(() => {
    if (isRunning && timerStartedAt) {
      baseSecondsRef.current = initialSeconds;
    }
    // Only on start — intentionally excluding initialSeconds from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timerStartedAt]);

  useEffect(() => {
    if (!isRunning || !timerStartedAt) return;

    const startedAt = new Date(timerStartedAt).getTime();
    let lastReported = -1;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const current = baseSecondsRef.current + elapsed;
      setDisplaySeconds(current);

      if (current !== lastReported) {
        lastReported = current;
        if (current % 5 === 0) onTickRef.current(current);
      }

      if (!halfTimeTriggered.current && current >= halfDurationSeconds) {
        halfTimeTriggered.current = true;
        onHalfTimeRef.current();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, timerStartedAt, halfDurationSeconds]);

  return displaySeconds;
}
