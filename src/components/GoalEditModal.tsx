import { useState } from 'react';
import { Goal, formatTime } from '@/types/match';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GoalEditModalProps {
  goal: Goal;
  goalNumber: number;
  onSave: (goalId: string, scorerName: string, assistName: string, goalTimeSeconds: number) => void;
  onDelete: (goalId: string) => void;
  onClose: () => void;
}

export function GoalEditModal({ goal, goalNumber, onSave, onDelete, onClose }: GoalEditModalProps) {
  const [scorer, setScorer] = useState(goal.scorerName);
  const [assist, setAssist] = useState(goal.assistName);
  const [mins, setMins] = useState(String(Math.floor(goal.goalTimeSeconds / 60)));
  const [secs, setSecs] = useState(String(goal.goalTimeSeconds % 60));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    const totalSecs = (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    onSave(goal.id, scorer.trim(), assist.trim(), Math.max(0, totalSecs));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30" />
      <div
        className="relative w-full max-w-lg bg-background rounded-t-2xl p-6 pb-10 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-2" />
        <h2 className="text-lg font-bold text-center text-foreground">Edit Goal #{goalNumber}</h2>

        <Input
          placeholder="Scorer name"
          value={scorer}
          onChange={e => setScorer(e.target.value)}
          className="h-14 text-lg bg-card text-foreground placeholder:text-muted-foreground border-border"
          autoComplete="off"
        />
        <Input
          placeholder="Assist name"
          value={assist}
          onChange={e => setAssist(e.target.value)}
          className="h-14 text-lg bg-card text-foreground placeholder:text-muted-foreground border-border"
          autoComplete="off"
        />

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground text-center">Goal time</p>
          <div className="flex items-center justify-center gap-2">
            <Input
              type="number"
              value={mins}
              onChange={e => setMins(e.target.value)}
              className="w-20 h-14 text-center text-2xl bg-card text-foreground border-border"
              min={0}
              inputMode="numeric"
            />
            <span className="text-2xl font-bold text-foreground">:</span>
            <Input
              type="number"
              value={secs}
              onChange={e => setSecs(e.target.value)}
              className="w-20 h-14 text-center text-2xl bg-card text-foreground border-border"
              min={0}
              max={59}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1 h-14 text-lg font-bold bg-primary text-primary-foreground">
            Save
          </Button>
        </div>

        {confirmDelete ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 h-12 text-foreground border-border">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => { onDelete(goal.id); onClose(); }}
              className="flex-1 h-12"
            >
              Confirm Delete
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            className="w-full h-12 text-destructive"
          >
            Delete Goal
          </Button>
        )}
      </div>
    </div>
  );
}
