import { useState } from 'react';
import { formatTime, HALF_DURATION_PRESETS, BREAK_DURATION_PRESETS, getPeriodLabel } from '@/types/match';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Square } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  currentSeconds: number;
  halfDurationSeconds: number;
  currentHalf: number;
  totalPeriods: number;
  periodType: 'halves' | 'quarters';
  onPauseResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onEditTime: (seconds: number) => void;
  onEditDuration: (seconds: number) => void;
  onStartNextPeriod: () => void;
  onEndMatch: () => void;
  onClose: () => void;
}

export function TimerControls({
  isRunning,
  currentSeconds,
  halfDurationSeconds,
  currentHalf,
  totalPeriods,
  periodType,
  onPauseResume,
  onStop,
  onReset,
  onEditTime,
  onEditDuration,
  onStartNextPeriod,
  onEndMatch,
  onClose,
}: TimerControlsProps) {
  const [editingTime, setEditingTime] = useState(false);
  const [editingDuration, setEditingDuration] = useState(false);
  const [timeMins, setTimeMins] = useState(String(Math.floor(currentSeconds / 60)));
  const [timeSecs, setTimeSecs] = useState(String(currentSeconds % 60));

  const handleSaveTime = () => {
    const total = (parseInt(timeMins) || 0) * 60 + (parseInt(timeSecs) || 0);
    onEditTime(Math.max(0, total));
    setEditingTime(false);
  };

  const periodLabel = periodType === 'halves' ? 'Half' : 'Quarter';
  const canStartNext = currentHalf < totalPeriods;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30" />
      <div
        className="relative w-full max-w-lg bg-background rounded-t-2xl p-6 pb-10 space-y-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />

        {editingTime ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Edit current time</p>
            <div className="flex items-center justify-center gap-2">
              <Input
                type="number"
                value={timeMins}
                onChange={e => setTimeMins(e.target.value)}
                className="w-20 h-14 text-center text-2xl bg-card text-foreground border-border"
                min={0}
                inputMode="numeric"
              />
              <span className="text-2xl font-bold text-foreground">:</span>
              <Input
                type="number"
                value={timeSecs}
                onChange={e => setTimeSecs(e.target.value)}
                className="w-20 h-14 text-center text-2xl bg-card text-foreground border-border"
                min={0}
                max={59}
                inputMode="numeric"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingTime(false)} className="flex-1 h-12 text-foreground border-border">
                Cancel
              </Button>
              <Button onClick={handleSaveTime} className="flex-1 h-12 bg-primary text-primary-foreground">
                Save
              </Button>
            </div>
          </div>
        ) : editingDuration ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">{periodLabel} duration (minutes)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {HALF_DURATION_PRESETS.map(m => (
                <button
                  key={m}
                  onClick={() => {
                    onEditDuration(m * 60);
                    setEditingDuration(false);
                  }}
                  className={`min-w-[3rem] h-12 px-3 rounded-lg text-lg font-semibold transition-colors ${
                    halfDurationSeconds === m * 60
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setEditingDuration(false)} className="w-full h-12 text-foreground border-border">
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <Button
              onClick={onPauseResume}
              className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground"
            >
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            {isRunning && (
              <Button
                onClick={() => {
                  onStop();
                  onClose();
                }}
                className="w-full h-12 bg-destructive text-destructive-foreground font-bold flex items-center justify-center gap-2"
              >
                <Square size={18} /> Stop Timer
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setTimeMins(String(Math.floor(currentSeconds / 60)));
                setTimeSecs(String(currentSeconds % 60));
                setEditingTime(true);
              }}
              className="w-full h-12 text-foreground border-border"
            >
              Edit Time ({formatTime(currentSeconds)})
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingDuration(true)}
              className="w-full h-12 text-foreground border-border"
            >
              {periodLabel} Duration ({formatTime(halfDurationSeconds)})
            </Button>
            {canStartNext && (
              <Button
                onClick={() => {
                  onStartNextPeriod();
                  onClose();
                }}
                className="w-full h-12 bg-accent text-accent-foreground font-bold"
              >
                Start {getPeriodLabel(currentHalf + 1, periodType)}
              </Button>
            )}
            <Button
              onClick={() => {
                onEndMatch();
                onClose();
              }}
              className="w-full h-12 bg-destructive text-destructive-foreground font-bold"
            >
              End Match
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full h-12 text-destructive border-border"
            >
              Reset Timer
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full h-12 text-muted-foreground"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
