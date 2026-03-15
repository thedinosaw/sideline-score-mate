import { useState } from 'react';
import { Match, Goal, TeamSide, formatTime, getTeamGoals, getTeamScore } from '@/types/match';
import { GoalEditModal } from '@/components/GoalEditModal';

interface MatchDetailsProps {
  match: Match;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function MatchDetails({ match, onUpdateGoal, onDeleteGoal }: MatchDetailsProps) {
  const [editingGoal, setEditingGoal] = useState<{ goal: Goal; number: number } | null>(null);

  const renderTeamSection = (team: TeamSide) => {
    const name = team === 'top' ? match.topTeamName : match.bottomTeamName;
    const label = team === 'top' ? 'Home' : 'Away';
    const goals = getTeamGoals(match.goals, team);
    const score = getTeamScore(match.goals, team);

    return (
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-1">
          {name || <span className="text-muted-foreground italic">{label}</span>}
        </h2>

        {/* Column headers */}
        <div className="flex items-center text-sm font-semibold text-muted-foreground px-2 py-2 border-b border-border">
          <span className="w-12 text-center">Goal</span>
          <span className="flex-1 text-center">Scorer (Assist)</span>
          <span className="w-16 text-center">Time</span>
        </div>

        {/* Goal list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {goals.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-lg text-muted-foreground">{score}</p>
            </div>
          ) : (
            goals.map((goal, idx) => (
              <button
                key={goal.id}
                onClick={() => setEditingGoal({ goal, number: idx + 1 })}
                className="flex items-center w-full px-2 py-3 text-left active:bg-secondary/50 transition-colors"
              >
                <span className="w-12 text-center text-2xl font-black text-foreground">{idx + 1}</span>
                <span className="flex-1 text-center text-lg font-medium text-foreground">
                  {goal.scorerName || '--'} ({goal.assistName || '--'})
                </span>
                <span className="w-16 text-center text-lg font-bold text-foreground">
                  {formatTime(goal.goalTimeSeconds)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {renderTeamSection('top')}
      <div className="h-[3px] bg-border flex-shrink-0" />
      {renderTeamSection('bottom')}

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
