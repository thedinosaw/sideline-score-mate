import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [unlocking, setUnlocking] = useState(false);
  const [holdTimer, setHoldTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleStart = () => {
    setUnlocking(true);
    const timer = setTimeout(() => {
      onUnlock();
    }, 1500);
    setHoldTimer(timer);
  };

  const handleEnd = () => {
    setUnlocking(false);
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <Lock className="w-16 h-16 text-muted-foreground mb-6" />
      <p className="text-xl font-bold text-foreground mb-2">Screen Locked</p>
      <p className="text-sm text-muted-foreground mb-8 text-center px-8">
        Hold the button below for 1.5 seconds to unlock
      </p>
      <button
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        className={`w-24 h-24 rounded-full border-4 border-border flex items-center justify-center transition-all duration-300 ${
          unlocking ? 'bg-primary scale-110 border-primary' : 'bg-secondary active:scale-95'
        }`}
      >
        <Unlock className={`w-10 h-10 transition-colors ${unlocking ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      </button>
      {unlocking && (
        <div className="mt-4 w-48 h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[fillBar_1.5s_linear_forwards]" />
        </div>
      )}
    </div>
  );
}
