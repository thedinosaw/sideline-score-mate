import { useState } from 'react';
import { HALF_DURATION_PRESETS, DEFAULT_HALF_DURATION, PeriodType, BREAK_DURATION_PRESETS } from '@/types/match';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SetupModalProps {
  onStart: (topName: string, bottomName: string, halfDuration: number, periodType: PeriodType, breakDuration: number) => void;
}

export function SetupModal({ onStart }: SetupModalProps) {
  const [topName, setTopName] = useState('');
  const [bottomName, setBottomName] = useState('');
  const [halfMins, setHalfMins] = useState(DEFAULT_HALF_DURATION / 60);
  const [periodType, setPeriodType] = useState<PeriodType>('halves');
  const [breakMins, setBreakMins] = useState(5);

  const periodLabel = periodType === 'halves' ? 'Half' : 'Quarter';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-y-auto">
      <div className="w-full max-w-sm px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-foreground">Match Setup</h1>

        <div className="space-y-3">
          <Input
            placeholder="Home team"
            value={topName}
            onChange={e => setTopName(e.target.value)}
            className="h-14 text-lg bg-card text-foreground placeholder:text-muted-foreground border-border"
            autoComplete="off"
          />
          <Input
            placeholder="Away team"
            value={bottomName}
            onChange={e => setBottomName(e.target.value)}
            className="h-14 text-lg bg-card text-foreground placeholder:text-muted-foreground border-border"
            autoComplete="off"
          />
        </div>

        {/* Period type selection */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Match format</p>
          <div className="flex justify-center gap-2">
            {(['halves', 'quarters'] as PeriodType[]).map(type => (
              <button
                key={type}
                onClick={() => setPeriodType(type)}
                className={`flex-1 h-12 rounded-lg text-lg font-semibold transition-colors ${
                  periodType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {type === 'halves' ? '2 Halves' : '4 Quarters'}
              </button>
            ))}
          </div>
        </div>

        {/* Period duration */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">{periodLabel} duration (minutes)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {HALF_DURATION_PRESETS.map(m => (
              <button
                key={m}
                onClick={() => setHalfMins(m)}
                className={`min-w-[3rem] h-12 px-3 rounded-lg text-lg font-semibold transition-colors ${
                  halfMins === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Break duration */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Break duration (minutes)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {BREAK_DURATION_PRESETS.map(m => (
              <button
                key={m}
                onClick={() => setBreakMins(m)}
                className={`min-w-[3rem] h-12 px-3 rounded-lg text-lg font-semibold transition-colors ${
                  breakMins === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onStart(topName, bottomName, halfMins * 60, periodType, breakMins * 60)}
          className="w-full h-14 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Start Match
        </Button>
      </div>
    </div>
  );
}
