import { useState, useEffect, useRef } from 'react';
import { formatTime, BREAK_DURATION_PRESETS } from '@/types/match';

interface BreakTimerProps {
  initialSeconds: number;
  periodLabel: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function BreakTimer({ initialSeconds, periodLabel, onComplete, onSkip }: BreakTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [selectedDuration, setSelectedDuration] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startedAt = useRef<number | null>(null);
  const baseRemaining = useRef(initialSeconds);

  useEffect(() => {
    if (!isRunning) return;
    if (startedAt.current === null) {
      startedAt.current = Date.now();
      baseRemaining.current = remaining;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current!) / 1000);
      const current = baseRemaining.current - elapsed;
      if (current <= 0) {
        setRemaining(0);
        clearInterval(interval);
        if ('vibrate' in navigator) navigator.vibrate([300, 100, 300]);
        onComplete();
      } else {
        setRemaining(current);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, remaining]);

  const handleSelectDuration = (mins: number) => {
    const secs = mins * 60;
    setSelectedDuration(secs);
    setRemaining(secs);
    startedAt.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6 py-8 space-y-6 text-center">
        <p className="text-lg font-bold text-foreground">{periodLabel} Break</p>
        
        <div className="text-6xl font-black text-foreground">
          {formatTime(remaining)}
        </div>

        {!isRunning && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Break duration (minutes)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {BREAK_DURATION_PRESETS.map(m => (
                <button
                  key={m}
                  onClick={() => handleSelectDuration(m)}
                  className={`min-w-[3rem] h-12 px-3 rounded-lg text-lg font-semibold transition-colors ${
                    selectedDuration === m * 60
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-bold"
            >
              Start Break Timer
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRunning(false);
                startedAt.current = null;
              }}
              className="w-full h-14 rounded-xl bg-secondary text-secondary-foreground text-lg font-bold"
            >
              Pause
            </button>
          )}
          <button
            onClick={onSkip}
            className="w-full h-12 rounded-xl bg-accent text-accent-foreground font-semibold"
          >
            Skip — Start Next Period
          </button>
        </div>
      </div>
    </div>
  );
}
