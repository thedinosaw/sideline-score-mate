import { useState } from 'react';
import { Match, Goal, formatTime } from '@/types/match';
import { GoalEditModal } from '@/components/GoalEditModal';

interface MatchDetailsProps {
  match: Match;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function MatchDetails({ match, onUpdateGoal, onDeleteGoal }: MatchDetailsProps) {
  const [editingGoal, setEditingGoal] = useState<{ goal: Goal; number: number } | null>(null);

  // All goals sorted chronologically: by half first, then by time
  const allGoals = [...match.goals].sort((a, b) => {
    if (a.half !== b.half) return a.half - b.half;
    return a.goalTimeSeconds - b.goalTimeSeconds;
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-lg font-bold text-foreground">
          {match.topTeamName || 'Home'} vs {match.bottomTeamName || 'Away'}
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          {match.goals.filter(g => g.team === 'top').length} – {match.goals.filter(g => g.team === 'bottom').length}
        </span>
      </div>

      {/* Column headers */}
      <div className="flex items-center text-xs font-semibold text-muted-foreground px-4 py-2 border-b border-border">
        <span className="w-10 text-center">#</span>
        <span className="w-16 text-center">Time</span>
        <span className="flex-1">Team</span>
        <span className="flex-1 text-center">Scorer (Assist)</span>
      </div>

      {/* Goal list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {allGoals.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">No goals yet</p>
          </div>
        ) : (
          allGoals.map((goal, idx) => {
            const teamName = goal.team === 'top'
              ? (match.topTeamName || 'Home')
              : (match.bottomTeamName || 'Away');

            return (
              <button
                key={goal.id}
                onClick={() => setEditingGoal({ goal, number: idx + 1 })}
                className="flex items-center w-full px-4 py-3 text-left active:bg-secondary/50 transition-colors border-b border-border/50"
              >
                <span className="w-10 text-center text-xl font-black text-foreground">{idx + 1}</span>
                <span className="w-16 text-center">
                  <span className="text-sm font-bold text-foreground">{formatTime(goal.goalTimeSeconds)}</span>
                  <span className="block text-xs text-muted-foreground">{goal.half === 1 ? '1st' : '2nd'}</span>
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground truncate">{teamName}</span>
                <span className="flex-1 text-center text-sm font-medium text-foreground">
                  {goal.scorerName || '--'} ({goal.assistName || '--'})
                </span>
              </button>
            );
          })
        )}
      </div>

      {editingGoal && (
        <GoalEditModal
          goal={editingGoal.goal}
          goalNumber={editingGoal.number}
          onSave={(id, scorer, assist, time) => {
            onUpdateGoal(id, { scorerName: scorer, assistName: assist, goalTimeSeconds: time });
          }}
          onDelete={onDeleteGoal}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  );
}
