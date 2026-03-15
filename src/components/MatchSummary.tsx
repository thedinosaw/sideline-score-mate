import { Match, formatTime, getTeamScore } from '@/types/match';
import { Button } from '@/components/ui/button';

interface MatchSummaryProps {
  match: Match;
  onClose: () => void;
}

export function MatchSummary({ match, onClose }: MatchSummaryProps) {
  const topScore = getTeamScore(match.goals, 'top');
  const bottomScore = getTeamScore(match.goals, 'bottom');
  const topName = match.topTeamName || 'Home';
  const bottomName = match.bottomTeamName || 'Away';

  // Half scores
  const top1st = match.goals.filter(g => g.team === 'top' && g.half === 1).length;
  const top2nd = match.goals.filter(g => g.team === 'top' && g.half === 2).length;
  const bottom1st = match.goals.filter(g => g.team === 'bottom' && g.half === 1).length;
  const bottom2nd = match.goals.filter(g => g.team === 'bottom' && g.half === 2).length;

  const totalGoals = match.goals.length;
  const firstGoal = [...match.goals].sort((a, b) => {
    if (a.half !== b.half) return a.half - b.half;
    return a.goalTimeSeconds - b.goalTimeSeconds;
  })[0];

  const winner = topScore > bottomScore ? topName : bottomScore > topScore ? bottomName : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50" onClick={onClose}>
      <div
        className="bg-background rounded-2xl p-6 mx-4 w-full max-w-sm space-y-5 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-center text-sm font-bold text-muted-foreground tracking-widest">MATCH SAVED</p>

        {/* Final score */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 text-right">
              <p className="text-lg font-bold text-foreground truncate">{topName}</p>
            </div>
            <p className="text-5xl font-black text-foreground">{topScore} – {bottomScore}</p>
            <div className="flex-1 text-left">
              <p className="text-lg font-bold text-foreground truncate">{bottomName}</p>
            </div>
          </div>
          {winner && (
            <p className="text-sm font-semibold text-primary">{winner} wins!</p>
          )}
          {!winner && totalGoals > 0 && (
            <p className="text-sm font-semibold text-muted-foreground">Draw</p>
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

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">{totalGoals}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Goals</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">
              {match.firstHalfSeconds != null
                ? formatTime(match.firstHalfSeconds + (match.currentTimerSeconds - (match.firstHalfSeconds ?? 0)))
                : formatTime(match.currentTimerSeconds)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">Duration</p>
          </div>
        </div>

        {firstGoal && (
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-foreground">
              First goal: {firstGoal.scorerName || 'Unknown'} ({formatTime(firstGoal.goalTimeSeconds)})
            </p>
            <p className="text-xs text-muted-foreground">
              {firstGoal.team === 'top' ? topName : bottomName}
            </p>
          </div>
        )}

        <Button onClick={onClose} className="w-full h-12 bg-primary text-primary-foreground font-bold">
          Done
        </Button>
      </div>
    </div>
  );
}
