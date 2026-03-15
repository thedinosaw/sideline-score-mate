export type TeamSide = 'top' | 'bottom';

export type MatchStatus = 'not_started' | 'live' | 'paused' | 'half_time' | 'second_half' | 'finished';

export interface Goal {
  id: string;
  team: TeamSide;
  scorerName: string;
  assistName: string;
  goalTimeSeconds: number;
  half: 1 | 2;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  createdAt: string;
  savedAt: string | null;
  topTeamName: string;
  bottomTeamName: string;
  halfDurationSeconds: number;
  currentTimerSeconds: number;
  timerRunning: boolean;
  timerStartedAt: string | null;
  status: MatchStatus;
  currentHalf: 1 | 2;
  firstHalfSeconds: number | null;
  goals: Goal[];
}

export const DEFAULT_HALF_DURATION = 30 * 60;

export const HALF_DURATION_PRESETS = [10, 15, 20, 25, 30, 35, 40, 45];

export function createNewMatch(): Match {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    savedAt: null,
    topTeamName: '',
    bottomTeamName: '',
    halfDurationSeconds: DEFAULT_HALF_DURATION,
    currentTimerSeconds: 0,
    timerRunning: false,
    timerStartedAt: null,
    status: 'not_started',
    currentHalf: 1,
    firstHalfSeconds: null,
    goals: [],
  };
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getTeamGoals(goals: Goal[], team: TeamSide): Goal[] {
  return goals.filter(g => g.team === team).sort((a, b) => a.goalTimeSeconds - b.goalTimeSeconds);
}

export function getTeamScore(goals: Goal[], team: TeamSide): number {
  return goals.filter(g => g.team === team).length;
}

export function getLatestGoal(goals: Goal[], team: TeamSide): Goal | undefined {
  const teamGoals = getTeamGoals(goals, team);
  return teamGoals.length > 0 ? teamGoals[teamGoals.length - 1] : undefined;
}

export function formatScorer(goal: Goal | undefined): string {
  if (!goal) return '';
  const scorer = goal.scorerName || '--';
  const assist = goal.assistName || '--';
  return `${scorer} (${assist})`;
}
