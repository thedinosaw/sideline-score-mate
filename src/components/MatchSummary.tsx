import { useState } from 'react';
import { Match, Goal, formatTime, getTeamScore, getTeamGoals } from '@/types/match';
import { Button } from '@/components/ui/button';
import { GoalEditModal } from '@/components/GoalEditModal';
import { Pencil } from 'lucide-react';

interface MatchSummaryProps {
  match: Match;
  onClose: () => void;
  onUpdateMatch?: (updated: Match) => void;
}

export function MatchSummary({ match, onClose, onUpdateMatch }: MatchSummaryProps) {
  const [localMatch, setLocalMatch] = useState(match);
  const [editingGoal, setEditingGoal] = useState<{ goal: Goal; number: number } | null>(null);

  const topScore = getTeamScore(localMatch.goals, 'top');
  const bottomScore = getTeamScore(localMatch.goals, 'bottom');
  const topName = localMatch.topTeamName || 'Home';
  const bottomName = localMatch.bottomTeamName || 'Away';

  const topGoals = getTeamGoals(localMatch.goals, 'top');
  const bottomGoals = getTeamGoals(localMatch.goals, 'bottom');

  // Half scores
  const top1st = localMatch.goals.filter(g => g.team === 'top' && g.half === 1).length;
  const top2nd = localMatch.goals.filter(g => g.team === 'top' && g.half === 2).length;
  const bottom1st = localMatch.goals.filter(g => g.team === 'bottom' && g.half === 1).length;
  const bottom2nd = localMatch.goals.filter(g => g.team === 'bottom' && g.half === 2).length;

  const totalGoals = localMatch.goals.length;
  const winner = topScore > bottomScore ? topName : bottomScore > topScore ? bottomName : null;

  const editable = !!onUpdateMatch;

  const applyUpdate = (updated: Match) => {
    setLocalMatch(updated);
    onUpdateMatch?.(updated);
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    const updated = {
      ...localMatch,
      goals: localMatch.goals.map(g =>
        g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    };
    applyUpdate(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = {
      ...localMatch,
      goals: localMatch.goals.filter(g => g.id !== goalId),
    };
    applyUpdate(updated);
  };

  const renderGoalList = (goals: Goal[], teamLabel: string) => {
    if (goals.length === 0) return <p className="text-xs text-muted-foreground italic">No goals</p>;
    return goals.map((goal, idx) => {
      const mins = Math.floor(goal.goalTimeSeconds / 60);
      return (
        <div
          key={goal.id}
          className={`flex items-center justify-between py-1.5 ${editable ? 'cursor-pointer active:bg-secondary/50 rounded-lg px-1 -mx-1' : ''}`}
          onClick={editable ? () => setEditingGoal({ goal, number: idx + 1 }) : undefined}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-sm font-semibold text-foreground truncate">
              {goal.scorerName || 'Unknown'}
            </span>
            {goal.assistName && (
              <span className="text-xs text-muted-foreground truncate">({goal.assistName})</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-muted-foreground">{mins}'</span>
            <span className="text-[10px] text-muted-foreground">{goal.half === 1 ? '1H' : '2H'}</span>
            {editable && <Pencil size={12} className="text-muted-foreground/50" />}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50" onClick={onClose}>
      <div
        className="bg-background rounded-2xl p-6 mx-4 w-full max-w-md space-y-4 shadow-lg max-h-[90dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-center text-sm font-bold text-muted-foreground tracking-widest">
          {editable ? 'MATCH DETAILS' : 'MATCH SAVED'}
        </p>

        {/* Final score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <p className="text-lg font-bold text-foreground truncate">{topName}</p>
            <p className="text-4xl font-black text-foreground">{topScore}</p>
          </div>
          <div className="flex items-center justify-between px-2">
            <p className="text-lg font-bold text-foreground truncate">{bottomName}</p>
            <p className="text-4xl font-black text-foreground">{bottomScore}</p>
          </div>
          {winner && (
            <p className="text-center text-sm font-semibold text-primary">{winner} wins!</p>
          )}
          {!winner && totalGoals > 0 && (
            <p className="text-center text-sm font-semibold text-muted-foreground">Draw</p>
          )}
        </div>

        {/* Half-by-half breakdown */}
        <div className="bg-card rounded-xl p-4 space-y-2">
          <div className="flex items-center text-xs font-semibold text-muted-foreground">
            <span className="flex-1" />
            <span className="w-16 text-center">{topName.slice(0, 8)}</span>
            <span className="w-16 text-center">{bottomName.slice(0, 8)}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex-1 font-medium text-foreground">1st Half</span>
            <span className="w-16 text-center font-bold text-foreground">{top1st}</span>
            <span className="w-16 text-center font-bold text-foreground">{bottom1st}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex-1 font-medium text-foreground">2nd Half</span>
            <span className="w-16 text-center font-bold text-foreground">{top2nd}</span>
            <span className="w-16 text-center font-bold text-foreground">{bottom2nd}</span>
          </div>
        </div>

        {/* Goal scorers by team */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 space-y-1">
            <p className="text-xs font-bold text-muted-foreground mb-2">{topName}</p>
            {renderGoalList(topGoals, topName)}
          </div>
          <div className="bg-card rounded-xl p-3 space-y-1">
            <p className="text-xs font-bold text-muted-foreground mb-2">{bottomName}</p>
            {renderGoalList(bottomGoals, bottomName)}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">{totalGoals}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Goals</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">
              {localMatch.firstHalfSeconds != null
                ? formatTime(localMatch.firstHalfSeconds + (localMatch.currentTimerSeconds - (localMatch.firstHalfSeconds ?? 0)))
                : formatTime(localMatch.currentTimerSeconds)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">Duration</p>
          </div>
        </div>

        <Button onClick={onClose} className="w-full h-12 bg-primary text-primary-foreground font-bold">
          Done
        </Button>
      </div>

      {editingGoal && (
        <GoalEditModal
          goal={editingGoal.goal}
          goalNumber={editingGoal.number}
          onSave={(id, scorer, assist, time) => {
            handleUpdateGoal(id, { scorerName: scorer, assistName: assist, goalTimeSeconds: time });
          }}
          onDelete={handleDeleteGoal}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  );
}
