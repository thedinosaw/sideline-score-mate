import { useState, useCallback } from 'react';
import {
  Match, Goal, TeamSide,
  formatTime, getTeamGoals, getTeamScore,
  getPeriodLabel, getPeriodTarget,
} from '@/types/match';
import { GoalEntryModal } from '@/components/GoalEntryModal';
import { TimerControls } from '@/components/TimerControls';
import { Undo2, Lock } from 'lucide-react';

interface HorizontalScoreboardProps {
  match: Match;
  displaySeconds: number;
  onPauseResume: () => void;
  onStop: () => void;
  onResetTimer: () => void;
  onEditTime: (seconds: number) => void;
  onEditDuration: (seconds: number) => void;
  onAddGoal: (team: TeamSide) => Goal;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
  onUndoGoal: (team: TeamSide) => void;
  onEditTeamName: (team: TeamSide, name: string) => void;
  halfTimeAlert: boolean;
  onDismissHalfTime: () => void;
  onStartNextPeriod: () => void;
  onEndMatch: () => void;
  onLock: () => void;
}

function formatGoalMinute(seconds: number): string {
  return `${Math.floor(seconds / 60)}'`;
}

export function HorizontalScoreboard({
  match,
  displaySeconds,
  onPauseResume,
  onStop,
  onResetTimer,
  onEditTime,
  onEditDuration,
  onAddGoal,
  onUpdateGoal,
  onUndoGoal,
  onEditTeamName,
  halfTimeAlert,
  onDismissHalfTime,
  onStartNextPeriod,
  onEndMatch,
  onLock,
}: HorizontalScoreboardProps) {
  const [showTimerControls, setShowTimerControls] = useState(false);
  const [pendingGoal, setPendingGoal] = useState<Goal | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamSide | null>(null);
  const [editName, setEditName] = useState('');

  const topScore = getTeamScore(match.goals, 'top');
  const bottomScore = getTeamScore(match.goals, 'bottom');
  const topGoals = getTeamGoals(match.goals, 'top');
  const bottomGoals = getTeamGoals(match.goals, 'bottom');

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

  const halfLabel = getPeriodLabel(match.currentHalf, match.periodType);
  const halfTarget = getPeriodTarget(match.currentHalf, match.halfDurationSeconds);
  const isOvertime = displaySeconds >= halfTarget;
  const isLastPeriod = match.currentHalf >= match.totalPeriods;
  const periodEndLabel = isLastPeriod ? 'FULL TIME' : `${halfLabel} TIME`;

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Lock button */}
      {match.status !== 'not_started' && match.status !== 'finished' && (
        <button
          onClick={onLock}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <Lock size={18} className="text-muted-foreground" />
        </button>
      )}

      {/* Half-time alert overlay */}
      {halfTimeAlert && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/60" onClick={onDismissHalfTime}>
          <div className="bg-background rounded-2xl p-8 mx-6 text-center space-y-4 shadow-lg" onClick={e => e.stopPropagation()}>
            <p className="text-4xl font-black text-foreground">{periodEndLabel}</p>
            <p className="text-lg text-muted-foreground">{formatTime(displaySeconds)}</p>
            {!isLastPeriod ? (
              <div className="space-y-3">
                <button onClick={onStartNextPeriod} className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                  Start {getPeriodLabel(match.currentHalf + 1, match.periodType)}
                </button>
                <button onClick={onDismissHalfTime} className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold">Dismiss</button>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={onEndMatch} className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-bold">End Match</button>
                <button onClick={onDismissHalfTime} className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold">Continue</button>
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

      {/* TIMER BOX at top */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => {
            if (match.status === 'not_started') {
              onPauseResume();
            } else {
              setShowTimerControls(true);
            }
          }}
          className={`w-full rounded-2xl border-2 ${isOvertime ? 'border-destructive' : 'border-border'} bg-card py-3 px-4 flex flex-col items-center justify-center active:scale-[0.98] transition-transform`}
        >
          <span className={`text-xs font-bold tracking-widest ${isOvertime ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOvertime ? 'OVERTIME' : `${halfLabel} ${match.periodType === 'quarters' ? '' : 'HALF'}`}
          </span>
          <span className={`text-3xl sm:text-4xl font-black leading-none ${isOvertime ? 'text-destructive' : 'text-foreground'}`}>
            {formatTime(displaySeconds)}
          </span>
          <span className="text-sm text-muted-foreground">
            / {formatTime(halfTarget)}
          </span>
          {!match.timerRunning && match.status === 'paused' && (
            <span className="text-xs text-muted-foreground mt-0.5">PAUSED</span>
          )}
          {match.status === 'not_started' && (
            <span className="text-xs text-muted-foreground mt-0.5">TAP TO START</span>
          )}
          {match.status === 'finished' && (
            <span className="text-xs font-bold text-primary mt-0.5">FINISHED</span>
          )}
        </button>
      </div>

      {/* SCORE ROW: Home - Score - Away */}
      <div className="flex items-center justify-center px-4 py-4 gap-2">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          <button
            onClick={() => handleStartEditName('top')}
            className="text-lg sm:text-xl font-bold text-foreground truncate max-w-full min-h-[1.5rem]"
          >
            {match.topTeamName || <span className="text-muted-foreground italic">Home</span>}
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 px-4">
          <button
            onClick={() => handleAddGoal('top')}
            className="text-6xl sm:text-7xl font-black text-foreground leading-none select-none active:scale-95 transition-transform"
          >
            {topScore}
          </button>
          <span className="text-4xl sm:text-5xl font-light text-muted-foreground select-none">-</span>
          <button
            onClick={() => handleAddGoal('bottom')}
            className="text-6xl sm:text-7xl font-black text-foreground leading-none select-none active:scale-95 transition-transform"
          >
            {bottomScore}
          </button>
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          <button
            onClick={() => handleStartEditName('bottom')}
            className="text-lg sm:text-xl font-bold text-foreground truncate max-w-full min-h-[1.5rem]"
          >
            {match.bottomTeamName || <span className="text-muted-foreground italic">Away</span>}
          </button>
        </div>
      </div>

      {/* Undo buttons */}
      <div className="flex justify-center gap-12 pb-2">
        {topScore > 0 && (
          <button onClick={() => onUndoGoal('top')} className="flex items-center gap-1 text-sm text-muted-foreground active:text-foreground">
            <Undo2 size={14} /> Undo
          </button>
        )}
        {bottomScore > 0 && (
          <button onClick={() => onUndoGoal('bottom')} className="flex items-center gap-1 text-sm text-muted-foreground active:text-foreground">
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>

      {/* Status label */}
      <div className="text-center pb-2">
        <span className="text-sm font-semibold text-muted-foreground">
          {match.status === 'finished' ? 'Full time' : match.status === 'half_time' ? `${halfLabel} time` : match.status === 'paused' ? 'Paused' : match.status === 'not_started' ? 'Not started' : 'Live'}
        </span>
      </div>

      {/* SCORERS */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="flex gap-4">
          {/* Home scorers */}
          <div className="flex-1 flex flex-col items-end gap-1">
            {topGoals.map(g => (
              <span key={g.id} className="text-sm text-foreground">
                {g.scorerName || '--'} <span className="text-muted-foreground">{formatGoalMinute(g.goalTimeSeconds)}</span>
              </span>
            ))}
          </div>

          {/* Divider with ball icon */}
          <div className="flex flex-col items-center pt-0.5">
            {(topGoals.length > 0 || bottomGoals.length > 0) && (
              <span className="text-muted-foreground text-lg">⚽</span>
            )}
          </div>

          {/* Away scorers */}
          <div className="flex-1 flex flex-col items-start gap-1">
            {bottomGoals.map(g => (
              <span key={g.id} className="text-sm text-foreground">
                {g.scorerName || '--'} <span className="text-muted-foreground">{formatGoalMinute(g.goalTimeSeconds)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timer controls sheet */}
      {showTimerControls && (
        <TimerControls
          isRunning={match.timerRunning}
          currentSeconds={displaySeconds}
          halfDurationSeconds={match.halfDurationSeconds}
          currentHalf={match.currentHalf}
          totalPeriods={match.totalPeriods}
          periodType={match.periodType}
          onPauseResume={() => { onPauseResume(); setShowTimerControls(false); }}
          onStop={() => { onStop(); setShowTimerControls(false); }}
          onReset={() => { onResetTimer(); setShowTimerControls(false); }}
          onEditTime={(s) => { onEditTime(s); setShowTimerControls(false); }}
          onEditDuration={onEditDuration}
          onStartNextPeriod={onStartNextPeriod}
          onEndMatch={() => { onEndMatch(); setShowTimerControls(false); }}
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
