export type TeamSide = 'top' | 'bottom';

export type MatchStatus = 'not_started' | 'live' | 'paused' | 'half_time' | 'second_half' | 'finished';

export type PeriodType = 'halves' | 'quarters';

export const BREAK_DURATION_PRESETS = [1, 3, 5, 10, 15];

export interface Goal {
  id: string;
  team: TeamSide;
  scorerName: string;
  assistName: string;
  goalTimeSeconds: number;
  half: number;
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
  currentHalf: number;
  firstHalfSeconds: number | null;
  goals: Goal[];
  periodType: PeriodType;
  totalPeriods: number;
  breakDurationSeconds: number;
  isLocked: boolean;
}

export const DEFAULT_HALF_DURATION = 30 * 60;

export const HALF_DURATION_PRESETS = [5, 10, 15, 20, 25, 30, 35, 40, 45];

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
    periodType: 'halves',
    totalPeriods: 2,
    breakDurationSeconds: 5 * 60,
    isLocked: false,
  };
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getTeamGoals(goals: Goal[], team: TeamSide): Goal[] {
  return goals.filter(g => g.team === team).sort((a, b) => {
    if (a.half !== b.half) return a.half - b.half;
    return a.goalTimeSeconds - b.goalTimeSeconds;
  });
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

export function getPeriodLabel(period: number, periodType: PeriodType): string {
  if (periodType === 'quarters') {
    return `Q${period}`;
  }
  return period === 1 ? '1ST' : '2ND';
}

export function getPeriodTarget(currentPeriod: number, periodDurationSeconds: number): number {
  return currentPeriod * periodDurationSeconds;
}
