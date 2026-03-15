import { useState, useCallback } from 'react';
import {
  Match, Goal, TeamSide,
  formatTime, formatScorer, getLatestGoal, getTeamScore,
} from '@/types/match';
import { GoalEntryModal } from '@/components/GoalEntryModal';
import { TimerControls } from '@/components/TimerControls';
import { Undo2 } from 'lucide-react';

interface LiveScoreboardProps {
  match: Match;
  displaySeconds: number;
  onPauseResume: () => void;
  onResetTimer: () => void;
  onEditTime: (seconds: number) => void;
  onEditDuration: (seconds: number) => void;
  onAddGoal: (team: TeamSide) => Goal;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
  onUndoGoal: (team: TeamSide) => void;
  onEditTeamName: (team: TeamSide, name: string) => void;
  halfTimeAlert: boolean;
  onDismissHalfTime: () => void;
  onStartSecondHalf: () => void;
  onEndMatch: () => void;
}

export function LiveScoreboard({
  match,
  displaySeconds,
  onPauseResume,
  onResetTimer,
  onEditTime,
  onEditDuration,
  onAddGoal,
  onUpdateGoal,
  onUndoGoal,
  onEditTeamName,
  halfTimeAlert,
  onDismissHalfTime,
  onStartSecondHalf,
  onEndMatch,
}: LiveScoreboardProps) {
  const [showTimerControls, setShowTimerControls] = useState(false);
  const [pendingGoal, setPendingGoal] = useState<Goal | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamSide | null>(null);
  const [editName, setEditName] = useState('');

  const topScore = getTeamScore(match.goals, 'top');
  const bottomScore = getTeamScore(match.goals, 'bottom');
  const topLatest = getLatestGoal(match.goals, 'top');
  const bottomLatest = getLatestGoal(match.goals, 'bottom');

  const handleAddGoal = useCallback((team: TeamSide) => {
    const goal = onAddGoal(team);
    setPendingGoal(goal);
  }, [onAddGoal]);

  const handleStartEditName = (team: TeamSide) => {
    setEditingTeam(team);
    setEditName(team === 'top' ? match.topTeamName : match.bottomTeamName);
  };

  const handleSaveName = () => {
    if (editingTeam) {
      onEditTeamName(editingTeam, editName.trim());
      setEditingTeam(null);
    }
  };

  const halfLabel = match.currentHalf === 1 ? '1ST' : '2ND';
  const halfTarget = match.currentHalf === 2
    ? match.halfDurationSeconds * 2
    : match.halfDurationSeconds;
  const isOvertime = displaySeconds >= halfTarget;

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Half-time alert overlay */}
      {halfTimeAlert && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/60" onClick={onDismissHalfTime}>
          <div className="bg-background rounded-2xl p-8 mx-6 text-center space-y-4 shadow-lg" onClick={e => e.stopPropagation()}>
            <p className="text-4xl font-black text-foreground">
              {match.currentHalf === 1 ? 'HALF TIME' : 'FULL TIME'}
            </p>
            <p className="text-lg text-muted-foreground">{formatTime(displaySeconds)}</p>
            {match.currentHalf === 1 ? (
              <div className="space-y-3">
                <button
                  onClick={onStartSecondHalf}
                  className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-bold"
                >
                  Start 2nd Half
                </button>
                <button
                  onClick={onDismissHalfTime}
                  className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={onEndMatch}
                  className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-bold"
                >
                  End Match
                </button>
                <button
                  onClick={onDismissHalfTime}
                  className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team name edit overlay */}
      {editingTeam && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/30" onClick={() => setEditingTeam(null)}>
          <div className="bg-background rounded-2xl p-6 mx-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <p className="text-lg font-bold text-foreground text-center">
              {editingTeam === 'top' ? 'Home' : 'Away'} Team Name
            </p>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full h-14 text-lg text-center rounded-xl bg-card text-foreground border-2 border-border px-4 outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              autoComplete="off"
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
            />
            <div className="flex gap-3">
              <button onClick={() => setEditingTeam(null)} className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold">Cancel</button>
              <button onClick={handleSaveName} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HALF */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        <button
          onClick={() => handleStartEditName('top')}
          className="text-xl sm:text-2xl font-semibold text-foreground truncate max-w-[80%] min-h-[2rem]"
        >
          {match.topTeamName || <span className="text-muted-foreground italic">Home</span>}
        </button>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => handleAddGoal('top')}
            className="text-7xl sm:text-8xl font-black text-foreground leading-none select-none active:scale-95 transition-transform"
          >
            {topScore}
          </button>
          {topLatest && (
            <span className="text-base sm:text-lg text-muted-foreground font-medium max-w-[40vw] truncate">
              {formatScorer(topLatest)}
            </span>
          )}
        </div>

        {topScore > 0 && (
          <button
            onClick={() => onUndoGoal('top')}
            className="mt-2 flex items-center gap-1 text-sm text-muted-foreground active:text-foreground"
          >
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>

      {/* CENTER DIVIDER + TIMER */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute left-0 right-0 h-[3px] bg-border" />

        <button
          onClick={() => {
            if (match.status === 'not_started') {
              onPauseResume();
            } else {
              setShowTimerControls(true);
            }
          }}
          className={`relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[3px] ${isOvertime ? 'border-destructive' : 'border-border'} bg-background flex flex-col items-center justify-center active:scale-95 transition-transform`}
        >
          {/* Half indicator */}
          <span className={`text-xs font-bold tracking-widest mb-1 ${isOvertime ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOvertime ? 'OVERTIME' : `${halfLabel} HALF`}
          </span>
          <span className={`text-4xl sm:text-5xl font-black leading-none ${isOvertime ? 'text-destructive' : 'text-foreground'}`}>
            {formatTime(displaySeconds)}
          </span>
          <span className="text-base text-muted-foreground mt-1">
            ({formatTime(match.currentHalf === 2 ? match.halfDurationSeconds * 2 : match.halfDurationSeconds)})
          </span>
          {!match.timerRunning && match.status === 'paused' && (
            <span className="text-xs text-muted-foreground mt-1">PAUSED</span>
          )}
          {match.status === 'not_started' && (
            <span className="text-xs text-muted-foreground mt-1">TAP TO START</span>
          )}
          {match.status === 'finished' && (
            <span className="text-xs font-bold text-primary mt-1">FINISHED</span>
          )}
        </button>
      </div>

      {/* BOTTOM HALF */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {bottomScore > 0 && (
          <button
            onClick={() => onUndoGoal('bottom')}
            className="mb-2 flex items-center gap-1 text-sm text-muted-foreground active:text-foreground"
          >
            <Undo2 size={14} /> Undo
          </button>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAddGoal('bottom')}
            className="text-7xl sm:text-8xl font-black text-foreground leading-none select-none active:scale-95 transition-transform"
          >
            {bottomScore}
          </button>
          {bottomLatest && (
            <span className="text-base sm:text-lg text-muted-foreground font-medium max-w-[40vw] truncate">
              {formatScorer(bottomLatest)}
            </span>
          )}
        </div>

        <button
          onClick={() => handleStartEditName('bottom')}
          className="text-xl sm:text-2xl font-semibold text-foreground truncate max-w-[80%] mt-2 min-h-[2rem]"
        >
          {match.bottomTeamName || <span className="text-muted-foreground italic">Away</span>}
        </button>
      </div>

      {/* Timer controls sheet */}
      {showTimerControls && (
        <TimerControls
          isRunning={match.timerRunning}
          currentSeconds={displaySeconds}
          halfDurationSeconds={match.halfDurationSeconds}
          currentHalf={match.currentHalf}
          onPauseResume={() => {
            onPauseResume();
            setShowTimerControls(false);
          }}
          onReset={() => {
            onResetTimer();
            setShowTimerControls(false);
          }}
          onEditTime={(s) => {
            onEditTime(s);
            setShowTimerControls(false);
          }}
          onEditDuration={onEditDuration}
          onStartSecondHalf={onStartSecondHalf}
          onClose={() => setShowTimerControls(false)}
        />
      )}

      {/* Goal entry modal */}
      {pendingGoal && (
        <GoalEntryModal
          goal={pendingGoal}
          onSave={(scorer, assist, time) => {
            onUpdateGoal(pendingGoal.id, { scorerName: scorer, assistName: assist, goalTimeSeconds: time });
            setPendingGoal(null);
          }}
          onCancel={() => setPendingGoal(null)}
        />
      )}
    </div>
  );
}
